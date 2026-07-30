import type { JwtPayload } from 'jsonwebtoken';

export type Categoria = {
	id: number;
	nome: string;
};

export type Produto = {
	id: number;
	nome: string;
	descricao: string | null;
	preco: number;
	quantidade: number;
	validade: Date | null;
	categoria: Categoria;
};

type Usuario = {
	id: number;
	name: string;
	email: string;
	password: string;
};

export type UsuarioPublico = Omit<Usuario, 'password'>;

export interface TokenPayload extends JwtPayload {
	id: number;
	iat: number;
	exp: number;
}
