import { z } from 'zod';

export const createCategoriaSchema = z.object({
	nome: z.string().min(1),
});

export const updateCategoriaSchema = z.object({
	nome: z.string().min(1),
});

export type CreateCategoria = z.infer<typeof createCategoriaSchema>;
export type UpdateCategoria = z.infer<typeof updateCategoriaSchema>;
