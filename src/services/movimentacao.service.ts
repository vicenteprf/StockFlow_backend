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
}: RegistrarMovimentacaoParams) {
	return await prisma.$transaction(async (tx) => {
		const produto = await tx.produto.findUnique({
			where: { id: produtoId },
		});

		if (!produto) {
			throw new NotFoundError('Produto não encontrado.');
		}

		if (tipo === 'SAIDA' && produto.quantidade < quantidade) {
			throw new UnprocessableEntityError(
				`Estoque insuficiente: Saldo atual (${produto.quantidade} é menor que a quantidade solicitada (${quantidade}))`,
			);
		}

		const movimentacao = await tx.movimentacaoEstoque.create({
			data: {
				produtoId,
				usuarioId,
				tipo,
				quantidade,
			},
		});

		const produtoAtualizado = await tx.produto.update({
			where: { id: produtoId },
			data: {
				quantidade:
					tipo === 'ENTRADA'
						? { increment: quantidade }
						: { decrement: quantidade },
			},
		});

		return { movimentacao, produtoAtualizado };
	});
}
