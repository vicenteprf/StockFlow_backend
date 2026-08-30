import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnprocessableEntityError } from '../errors/index.ts';
import type { RegistrarMovimentacaoBody } from '../schemas/movimentacao.schema.ts';
import { getAdminIdBase } from '../utils/equipe.ts';

interface RegistrarMovimentacaoParams extends RegistrarMovimentacaoBody {
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
		}

		const movimentacao = await tx.movimentacaoEstoque.create({
			data: {
				produtoId,
				usuarioId,
				tipo,
				quantidade,
				preco,
				validade,
				motivo,
				observacao,
			},
			include: {
				produto: true,
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
			produto: true,
		},
		orderBy: { criado: 'desc' },
	});

	return movimentacoes;
}
