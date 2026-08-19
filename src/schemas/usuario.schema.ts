import { z } from 'zod';

export const createUsuarioSchema = z.object({
	nome: z.string().min(1),
	empresa: z.string().optional(),
	email: z.email(),
	password: z.string().min(6),
});

export type CreateUsuario = z.infer<typeof createUsuarioSchema>;
