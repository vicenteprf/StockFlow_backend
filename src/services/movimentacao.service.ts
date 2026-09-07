import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnprocessableEntityError } from '../errors/index.ts';
import type {
	EntradaDeProdutosBody,
	RegistrarMovimentacaoBody,
} from '../schemas/movimentacao.schema.ts';
import { getAdminIdBase } from '../utils/equipe.ts';

interface RegistrarMovimentacaoParams extends RegistrarMovimentacaoBody {
	usuarioId: number;
}

interface EntradaDeProdutosBodyParams extends EntradaDeProdutosBody {
	usuarioId: number;
}

export async function criarMovimentacaoService(
	{
		produtoId,
		usuarioId,
		tipo,
		quantidade,
		preco,
		validade,
		motivo,
		observacao,
	}: RegistrarMovimentacaoParams,
	usuarioLogadoId: number,
) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	return await prisma.$transaction(async (tx) => {
		const produto = await tx.produto.findUnique({
			where: { id: produtoId, adminId: adminIdBase },
		});

		if (!produto) {
			throw new NotFoundError('Produto não encontrado.');
		}

		let precoFinal = preco;

		if (tipo === 'SAIDA') {
			const movimentacao = await tx.movimentacaoEstoque.findMany({
				where: {
					produtoId,
				},
				select: { tipo: true, quantidade: true },
			});

			const saldoAtual = movimentacao.reduce((acc, mov) => {
				return mov.tipo === 'ENTRADA'
					? acc + mov.quantidade
					: acc - mov.quantidade;
			}, 0);

			if (saldoAtual < quantidade) {
				throw new UnprocessableEntityError(
					`Estoque insuficiente: saldo atual (${saldoAtual}) é menor que a quantidade solicitada (${quantidade}).`,
				);
			}

			if (precoFinal === undefined || precoFinal === null) {
				const ultimaEntrada = await tx.movimentacaoEstoque.findFirst({
					where: {
						produtoId,
						tipo: 'ENTRADA',
						preco: {
							not: null,
						},
					},
					orderBy: {
						criado: 'desc',
					},
				});

				if (ultimaEntrada?.preco) {
					precoFinal = Number(ultimaEntrada.preco);
				}
			}
		}

		const movimentacao = await tx.movimentacaoEstoque.create({
			data: {
				produtoId,
				usuarioId,
				tipo,
				quantidade,
				preco: precoFinal,
				validade,
				motivo,
				observacao,
			},
			include: {
				produto: {
					include: {
						categoria: true,
					},
				},
			},
		});

		return movimentacao;
	});
}

export async function findAllMovimentacoes(
	usuarioLogadoId: number,
	usuarioId?: number,
	nomeUsuario?: string,
) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	const movimentacoes = await prisma.movimentacaoEstoque.findMany({
		where: {
			produto: {
				adminId: adminIdBase,
			},
			...(usuarioId ? { usuarioId } : {}),
			...(nomeUsuario
				? {
						usuario: {
							nome: {
								contains: nomeUsuario,
								mode: 'insensitive',
							},
						},
					}
				: {}),
		},
		include: {
			produto: {
				include: {
					categoria: true,
				},
			},
		},
		orderBy: { criado: 'desc' },
	});

	return movimentacoes;
}

export async function criarMovimentacaoLoteService(
	{ itens, observacao, usuarioId }: EntradaDeProdutosBodyParams,
	usuarioLogadoId: number,
) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	return await prisma.$transaction(async (tx) => {
		for (const item of itens) {
			const produto = await tx.produto.findUnique({
				where: { id: item.produtoId, adminId: adminIdBase },
			});

			if (!produto) {
				throw new NotFoundError(`Produto ID ${item.produtoId} não encontrado.`);
			}
		}

		const movimentacoes = [];
		for (const item of itens) {
			const mov = await tx.movimentacaoEstoque.create({
				data: {
					produtoId: item.produtoId,
					usuarioId,
					tipo: 'ENTRADA',
					quantidade: item.quantidade,
					preco: item.preco,
					validade: item.validade,
					observacao,
				},
			});
			movimentacoes.push(mov);
		}

		return movimentacoes;
	});
}
