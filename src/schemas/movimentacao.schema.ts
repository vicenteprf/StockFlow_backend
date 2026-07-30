// src/schemas/movimentacao.schema.ts
import { z } from 'zod';

export const registrarMovimentacaoSchema = z.object({
	produtoId: z
		.number({ message: 'O ID do produto é obrigatório' })
		.int()
		.positive('ID do produto inválido'),

	quantidade: z
		.number({ message: 'A quantidade é obrigatória' })
		.int('A quantidade deve ser um número inteiro')
		.positive('A quantidade deve ser maior que zero'),

	tipo: z.enum(['ENTRADA', 'SAIDA'], {
		message: 'O tipo deve ser ENTRADA ou SAIDA',
	}),
});

export type RegistrarMovimentacaoBody = z.infer<
	typeof registrarMovimentacaoSchema
>;
