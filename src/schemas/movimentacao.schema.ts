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

	preco: z
		.number({ message: 'O preço deve ser um número.' })
		.positive('O preço dever ser maior que zero.')
		.optional(),

	validade: z.coerce.date({ message: 'Data de validade inválida.' }).optional(),
});

export type RegistrarMovimentacaoBody = z.infer<
	typeof registrarMovimentacaoSchema
>;
