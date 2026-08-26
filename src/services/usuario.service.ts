import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.ts';
import { prisma } from '../data/cliente.Prisma.ts';
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/index.ts';
import type { CreateUsuario } from '../schemas/usuario.schema.ts';
import type { UsuarioPublico } from '../Types/types.ts';

function isPrismaKnownError(e: unknown): e is { code: string } {
	return (
		typeof e === 'object' &&
		e !== null &&
		'code' in e &&
		typeof (e as { code: unknown }).code === 'string'
	);
}

const SALT_ROUNDS = 10;

export async function findAllUsuarioDaEquipe(usuarioLogadoId: number) {
	if (!usuarioLogadoId) {
		throw new UnauthorizedError('Usuário não autenticado.');
	}

	const usuarioLogado = await prisma.usuario.findUnique({
		where: { id: usuarioLogadoId },
		select: { id: true, role: true, adminId: true },
	});

	if (!usuarioLogado) {
		throw new NotFoundError('Usuário não encontrado.');
	}

	const adminIdBase =
		usuarioLogado.role === 'ADMIN' ? usuarioLogado.id : usuarioLogado.adminId;

	if (!adminIdBase) {
		return [usuarioLogado];
	}

	return await prisma.usuario.findMany({
		where: {
			OR: [{ id: adminIdBase }, { adminId: adminIdBase }],
		},
		omit: {
			password: true,
		},
	});
}

export async function findUsuarioById(id: number) {
	if (isNaN(id)) {
		throw new NotFoundError('ID inválido.');
	}
	const usuarioId = await prisma.usuario.findUnique({
		where: {
			id,
		},
		omit: {
			password: true,
		},
	});

	if (!usuarioId) {
		throw new NotFoundError('Usuario não encontrado.');
	}

	return usuarioId;
}

export async function insertUsuario({
	nome,
	empresa,
	email,
	password,
}: CreateUsuario): Promise<{ usuario: UsuarioPublico; token: string }> {
	try {
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		const newUsuario = await prisma.usuario.create({
			data: {
				nome,
				empresa,
				email,
				role: 'ADMIN',
				password: hashedPassword,
			},
			omit: {
				password: true,
			},
		});

		const token = jwt.sign(
			{ id: newUsuario.id, role: newUsuario.role },
			authConfig.secret,
			{
				expiresIn: authConfig.expiresIn,
			},
		);

		return {
			usuario: newUsuario,
			token,
		};
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2002') {
			throw new ConflictError('Já existe um usuário com este e-mail.');
		}

		throw e;
	}
}

export async function convidarMembro({
	nome,
	email,
	password,
	adminId,
}: CreateUsuario & { adminId: number }) {
	if (!adminId) {
		throw new UnauthorizedError('Usuário não autenticado.');
	}

	try {
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

		return await prisma.usuario.create({
			data: {
				nome,
				email,
				password: hashedPassword,
				role: 'USER',
				adminId,
			},
			omit: {
				password: true,
			},
		});
	} catch (e) {
		if (isPrismaKnownError(e) && e.code === 'P2002') {
			throw new ConflictError('Já existe um usuário com este e-mail.');
		}
		throw e;
	}
}
