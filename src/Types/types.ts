import type { JwtPayload } from 'jsonwebtoken';
import type { Role } from '../generated/prisma/enums.ts';

export type Categoria = {
	id: number;
	nome: string;
};

export type Produto = {
	id: number;
	codigo: number;
	nome: string;
	descricao: string | null;
	categoria: Categoria;
};

type Usuario = {
	id: number;
	nome: string;
	empresa: string | null;
	email: string;
	role: Role;
	password: string;
};

export type UsuarioPublico = Omit<Usuario, 'password'>;

export interface TokenPayload extends JwtPayload {
	id: number;
	role: Role;
	iat: number;
	exp: number;
}
