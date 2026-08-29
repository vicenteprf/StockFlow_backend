import { prisma } from '../data/cliente.Prisma.ts';
import { ConflictError, NotFoundError } from '../errors/index.ts';
import type {
	CreateCategoria,
	UpdateCategoria,
} from '../schemas/categoria.schema.ts';
import type { Categoria } from '../Types/types.ts';
import { getAdminIdBase } from '../utils/equipe.ts';

function isPrismaKnownError(e: unknown): e is { code: string } {
	return (
		typeof e === 'object' &&
		e !== null &&
		'code' in e &&
		typeof (e as { code: unknown }).code === 'string'
	);
}

export async function findAllCategoria(usuarioLogadoId: number) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	return await prisma.categoria.findMany({
		where: { adminId: adminIdBase },
	});
}

export async function findCategoriaById(id: number, usuarioLogadoId: number) {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	const categoryId = await prisma.categoria.findFirst({
		where: {
			id,
			adminId: adminIdBase,
		},
	});

	if (!categoryId) {
		throw new NotFoundError('Categoria não encontrada.');
	}

	return categoryId;
}

export async function insertCategoria(
	{ nome }: CreateCategoria,
	usuarioLogadoId: number,
): Promise<Categoria> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	try {
		const newCategory: Categoria = await prisma.categoria.create({
			data: {
				nome,
				adminId: adminIdBase,
			},
		});

		return newCategory;
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2002') {
			throw new ConflictError('Categoria já existe.');
		}

		throw e;
	}
}

export async function modifyCategoria(
	id: number,
	{ nome }: UpdateCategoria,
	usuarioLogadoId: number,
): Promise<Categoria> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	try {
		const modifyCategoria = await prisma.categoria.update({
			where: {
				id,
				adminId: adminIdBase,
			},
			data: {
				nome,
			},
		});

		return modifyCategoria;
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new NotFoundError('Categoria não encontrada.');
		}

		throw e;
	}
}

export async function removeCategoria(
	id: number,
	usuarioLogadoId: number,
): Promise<void> {
	const adminIdBase = await getAdminIdBase(usuarioLogadoId);

	try {
		await prisma.categoria.delete({
			where: {
				id,
				adminId: adminIdBase,
			},
		});
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2025') {
			throw new NotFoundError('Categoria não encontrada.');
		}

		throw e;
	}
}
