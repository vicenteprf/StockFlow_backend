import type { JwtPayload } from 'jsonwebtoken';

export type Categoria = {
	id: number;
	nome: string;
};

export type CreateCategoria = Omit<Categoria, 'id'>;

export type UpdateCategoria = Categoria;

export type Produto = {
	id: number;
	nome: string;
	descricao: string | null;
	preco: number;
	quantidade: number;
	validade: Date | null;
	categoria: Categoria;
};

export type CreateProduto = Omit<Produto, 'id' | 'categoria'> & {
	categoria: number;
};

export type UpdateProduto = {
	id: number;
	nome: string;
	descricao: string | null;
	preco: number;
	quantidade: number;
	validade: Date | null;
	categoria: number;
};

type Usuario = {
	id: number;
	name: string;
	email: string;
	password: string;
};

export type UsuarioPublico = Omit<Usuario, 'password'>;

export type CreateUsuario = Omit<Usuario, 'id'>;

export interface TokenPayload extends JwtPayload {
	id: number;
	iat: number;
	exp: number;
}
