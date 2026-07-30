import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/index.ts';
import { criarMovimentacaoService } from '../services/movimentacao.service.ts';

export async function criarMovimentacaoController(req: Request, res: Response) {
	const usuarioId = req.id;

	if (!usuarioId) {
		throw new NotFoundError('Usuário não autenticado.');
	}

	const resultado = await criarMovimentacaoService({
		...req.body,
		usuarioId,
	});

	return res.status(201).json({
		mensagem: 'Movimentação realizada com sucesso',
		dados: resultado,
	});
}
