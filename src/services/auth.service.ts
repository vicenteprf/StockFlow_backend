import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.ts';
import { prisma } from '../data/cliente.Prisma.ts';
import { UnauthorizedError } from '../errors/index.ts';

export async function login(email: string, password: string) {
	const usuario = await prisma.usuario.findUnique({
		where: {
			email,
		},
	});

	if (!usuario) {
		throw new UnauthorizedError('Credenciais inválidas.');
	}

	const senhaValida = await bcrypt.compare(password, usuario.password);

	if (!senhaValida) {
		throw new UnauthorizedError('Credenciais inválidas.');
	}

	const { id, name } = usuario;

	const token = jwt.sign({ id }, authConfig.secret, {
		expiresIn: authConfig.expiresIn,
	});

	return {
		usuario: {
			id,
			name,
			email,
		},
		token,
	};
}
