import { z } from 'zod';

export const createProdutoSchema = z.object({
	nome: z.string().min(1),
	descricao: z.string().min(1).optional(),
	categoriaId: z.number(),
});

export const updateProdutoSchema = z.object({
	nome: z.string().min(1),
	descricao: z.string().min(1).optional(),
	categoriaId: z.number(),
});

export type CreateProduto = z.infer<typeof createProdutoSchema>;
export type UpdateProduto = z.infer<typeof updateProdutoSchema>;
