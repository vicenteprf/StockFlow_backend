export type Categoria = {
	id: number;
	nome: string;
};

export type CreateCategoria = Omit<Categoria, 'id'>;

export type UpdateCategoria = Categoria;
