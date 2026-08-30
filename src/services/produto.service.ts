import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnprocessableEntityError } from '../errors/index.ts';
import type {
	CreateProduto,
	UpdateProduto,
} from '../schemas/produto.schema.ts';
import type { Produto } from '../Types/types.ts';
import { getAdminIdBase } from '../utils/equipe.ts';

function isPrismaKnownError(e: unknown): e is { code: string } {
	return (
		typeof e === 'object' &&
		e !== null &&
		'code' in e &&
		typeof (e as { code: unknown }).code === 'string'
	);
}

export async function findAllProdutos(usuarioLogadoId: number) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	const allProdutos = await prisma.produto.findMany({
		where: {
			adminId: adminIdBase,
		},
		include: {
			categoria: true,
			movimentacoes: {
				select: {
					tipo: true,
					quantidade: true,
					validade: true,
					criado: true,
				},
				orderBy: {
					criado: 'desc',
				},
			},
		},
		orderBy: {
			codigo: 'asc',
		},
	});

	return allProdutos.map((produto) => {
		const quantidadeEstoque = produto.movimentacoes.reduce((acc, mov) => {
			if (mov.tipo === 'ENTRADA') {
				return acc + mov.quantidade;
			}
			if (mov.tipo === 'SAIDA') {
				return acc - mov.quantidade;
			}

			return acc;
		}, 0);

		// Busca a validade da última movimentação do tipo ENTRADA
		const ultimaEntrada = produto.movimentacoes.find(
			(mov) => mov.tipo === 'ENTRADA' && mov.validade !== null,
		);

		const { movimentacoes, ...restoDoProduto } = produto;

		return {
			...restoDoProduto,
			quantidadeEstoque,
			validade: ultimaEntrada?.validade || null,
		};
	});
}

export async function findProdutoById(id: number, usuarioLogadoId: number) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	const produto = await prisma.produto.findFirst({
		where: {
			id,
			adminId: adminIdBase,
		},
		include: {
			categoria: true,
			movimentacoes: {
				select: {
					tipo: true,
					quantidade: true,
					validade: true,
					criado: true,
				},
				orderBy: {
					criado: 'desc',
				},
			},
		},
	});

	if (!produto) {
		throw new NotFoundError('Produto não encontrado.');
	}

	const quantidadeEstoque = produto.movimentacoes.reduce((acc, mov) => {
		return mov.tipo === 'ENTRADA' ? acc + mov.quantidade : acc - mov.quantidade;
	}, 0);

	const ultimaEntrada = produto.movimentacoes.find(
		(mov) => mov.tipo === 'ENTRADA' && mov.validade !== null,
	);

	const { movimentacoes, ...restoDoProduto } = produto;

	return {
		...restoDoProduto,
		quantidadeEstoque,
		validade: ultimaEntrada?.validade || null,
	};
}

export async function insertProduto(
	{ nome, descricao, categoriaId }: CreateProduto,
	usuarioLogadoId: number,
): Promise<Produto> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	const categoriaDaEquipe = await prisma.categoria.findFirst({
		where: {
			id: categoriaId,
			adminId: adminIdBase,
		},
	});

	if (!categoriaDaEquipe) {
		throw new UnprocessableEntityError(
			'Categoria não encontrada ou não pertence à sua equipe.',
		);
	}

	try {
		const newProduto = await prisma.produto.create({
			data: {
				nome,
				descricao,
				categoriaId: categoriaId,
				adminId: adminIdBase,
			},
			include: {
				categoria: true,
			},
		});

		return {
			id: newProduto.id,
			codigo: newProduto.codigo,
			nome: newProduto.nome,
			descricao: newProduto.descricao,
			categoria: newProduto.categoria,
		};
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2003') {
			throw new UnprocessableEntityError('Categoria não encontrada.');
		}

		throw e;
	}
}

export async function modifyProduto(
	id: number,
	{ nome, descricao, categoriaId }: UpdateProduto,
	usuarioLogadoId: number,
): Promise<Produto> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	try {
		const modified = await prisma.produto.update({
			where: {
				id,
				adminId: adminIdBase,
			},
			data: {
				nome,
				descricao,
				categoriaId: categoriaId,
			},
			include: {
				categoria: true,
			},
		});

		return {
			id: modified.id,
			codigo: modified.codigo,
			nome: modified.nome,
			descricao: modified.descricao,
			categoria: modified.categoria,
		};
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2003') {
			throw new UnprocessableEntityError('Categoria não encontrada.');
		}

		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new NotFoundError('Produto não encontrado.');
		}

		throw e;
	}
}

export async function removeProduto(
	id: number,
	usuarioLogadoId: number,
): Promise<void> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	try {
		await prisma.produto.delete({
			where: {
				id,
				adminId: adminIdBase,
			},
		});
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new NotFoundError('Produto não encontrado.');
		}
		throw e;
	}
}
