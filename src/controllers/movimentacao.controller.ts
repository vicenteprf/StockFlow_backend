import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/index.ts';
import {
	criarMovimentacaoService,
	findAllMovimentacoes,
} from '../services/movimentacao.service.ts';

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

export async function getMovimentacoes(req: Request, res: Response) {
	const { usuarioId: usuarioIdQuery, nome } = req.query;
	const usuarioId = usuarioIdQuery ? Number(usuarioIdQuery) : undefined;
	const nomeUsuario = typeof nome === 'string' ? nome : undefined;

	const movimentacoes = await findAllMovimentacoes(usuarioId, nomeUsuario);

	return res.status(200).json(movimentacoes);
}
