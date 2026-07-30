import { z } from 'zod';

export const createUsuarioSchema = z.object({
	name: z.string().min(1),
	email: z.email(),
	password: z.string().min(6),
});

export type CreateUsuario = z.infer<typeof createUsuarioSchema>;
