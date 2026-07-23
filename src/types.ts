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
