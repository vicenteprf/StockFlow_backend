import { prisma } from '../data/cliente.Prisma.ts';
import type { Categoria, CreateCategoria, UpdateCategoria } from '../types.ts';

function isPrismaKnownError(e: unknown): e is { code: string } {
	return (
		typeof e === 'object' &&
		e !== null &&
		'code' in e &&
		typeof (e as { code: unknown }).code === 'string'
	);
}

export async function findAllCategoria() {
	const allCategory = await prisma.categoria.findMany();

	return allCategory;
}

export async function findCategoriaById(id: number) {
	const categoryId = await prisma.categoria.findUnique({
		where: {
			id,
		},
	});

	if (!categoryId) {
		throw new Error('Categoria não encontrada.');
	}

	return categoryId;
}

export async function insertCategoria({
	nome,
}: CreateCategoria): Promise<Categoria> {
	try {
		const newCategory: Categoria = await prisma.categoria.create({
			data: {
				nome,
			},
		});

		return newCategory;
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2002') {
			throw new Error('Categoria já existe.');
		}

		throw e;
	}
}

export async function modifyCategoria({
	id,
	nome,
}: UpdateCategoria): Promise<Categoria> {
	try {
		const modifyCategoria = await prisma.categoria.update({
			where: {
				id,
			},
			data: {
				nome,
			},
		});

		return modifyCategoria;
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new Error('Categoria não encontrada.');
		}

		throw e;
	}
}

export async function removeCategoria(id: number): Promise<void> {
	try {
		await prisma.categoria.delete({
			where: {
				id,
			},
		});
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new Error('Categoria não encontrada.');
		}

		throw e;
	}
}
