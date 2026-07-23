import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnprocessableEntityError } from '../errors/index.ts';
import type { CreateProduto, Produto, UpdateProduto } from '../types.ts';

function isPrismaKnownError(e: unknown): e is { code: string } {
	return (
		typeof e === 'object' &&
		e !== null &&
		'code' in e &&
		typeof (e as { code: unknown }).code === 'string'
	);
}

export async function findAllProdutos() {
	const allProdutos = await prisma.produto.findMany({
		include: {
			categoria: true,
		},
	});

	return allProdutos;
}

export async function findProdutoById(id: number) {
	const produtoId = await prisma.produto.findUnique({
		where: {
			id,
		},
		include: {
			categoria: true,
		},
	});

	if (!produtoId) {
		throw new NotFoundError('Produto não encontrado.');
	}

	return produtoId;
}

export async function insertProduto({
	nome,
	descricao,
	preco,
	quantidade,
	validade,
	categoria,
}: CreateProduto): Promise<Produto> {
	try {
		const newProduto = await prisma.produto.create({
			data: {
				nome,
				descricao,
				preco,
				quantidade,
				validade,
				categoriaId: categoria,
			},
			include: {
				categoria: true,
			},
		});

		return {
			id: newProduto.id,
			nome: newProduto.nome,
			descricao: newProduto.descricao,
			preco: newProduto.preco.toNumber(),
			quantidade: newProduto.quantidade,
			validade: newProduto.validade,
			categoria: newProduto.categoria,
		};
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2003') {
			throw new UnprocessableEntityError('Categoria não encontrada.');
		}

		throw e;
	}
}

export async function modifyProduto({
	id,
	nome,
	descricao,
	preco,
	quantidade,
	validade,
	categoria,
}: UpdateProduto): Promise<Produto> {
	try {
		const modifyProduto = await prisma.produto.update({
			where: {
				id,
			},
			data: {
				nome,
				descricao,
				preco,
				quantidade,
				validade,
				categoriaId: categoria,
			},
			include: {
				categoria: true,
			},
		});

		return {
			id: id,
			nome: modifyProduto.nome,
			descricao: modifyProduto.descricao,
			preco: modifyProduto.preco.toNumber(),
			quantidade: modifyProduto.quantidade,
			validade: modifyProduto.validade,
			categoria: modifyProduto.categoria,
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

export async function removeProduto(id: number): Promise<void> {
	try {
		await prisma.produto.delete({
			where: {
				id,
			},
		});
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new NotFoundError('Produto não encontrado.');
		}
		throw e;
	}
}
