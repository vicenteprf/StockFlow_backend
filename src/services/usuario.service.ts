import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.ts';
import { prisma } from '../data/cliente.Prisma.ts';
import { ConflictError, NotFoundError } from '../errors/index.ts';
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

export async function findAllUsuario() {
	const allUsuario = await prisma.usuario.findMany({
		omit: {
			password: true,
		},
	});

	return allUsuario;
}

export async function findUsuarioById(id: number) {
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
				password: hashedPassword,
			},
			omit: {
				password: true,
			},
		});

		const token = jwt.sign({ id: newUsuario.id }, authConfig.secret, {
			expiresIn: authConfig.expiresIn,
		});

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
