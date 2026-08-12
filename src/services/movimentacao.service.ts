import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnprocessableEntityError } from '../errors/index.ts';
import type { RegistrarMovimentacaoBody } from '../schemas/movimentacao.schema.ts';

interface RegistrarMovimentacaoParams extends RegistrarMovimentacaoBody {
	usuarioId: number;
}

export async function criarMovimentacaoService({
	produtoId,
	usuarioId,
	tipo,
	quantidade,
	preco,
	validade,
}: RegistrarMovimentacaoParams) {
	return await prisma.$transaction(async (tx) => {
		const produto = await tx.produto.findUnique({
			where: { id: produtoId },
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
			},
			include: {
				produto: true,
			},
		});

		return movimentacao;
	});
}
