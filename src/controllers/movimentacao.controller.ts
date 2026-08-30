import type { Request, Response } from 'express';
import { NotFoundError } from '../errors/index.ts';
import {
	criarMovimentacaoService,
	findAllMovimentacoes,
} from '../services/movimentacao.service.ts';

export async function criarMovimentacaoController(req: Request, res: Response) {
	const usuarioLogadoId = Number(req.id);

	if (!usuarioLogadoId) {
		throw new NotFoundError('Usuário não autenticado.');
	}

	const resultado = await criarMovimentacaoService(
		{
			...req.body,
			usuarioId: usuarioLogadoId,
		},
		usuarioLogadoId,
	);

	return res.status(201).json({
		mensagem: 'Movimentação realizada com sucesso',
		dados: resultado,
	});
}

export async function getMovimentacoes(req: Request, res: Response) {
	const { usuarioId: usuarioIdQuery, nome } = req.query;
	const usuarioId = usuarioIdQuery ? Number(usuarioIdQuery) : undefined;
	const nomeUsuario = typeof nome === 'string' ? nome : undefined;
	const usuarioLogado = Number(req.id);

	const movimentacoes = await findAllMovimentacoes(
		usuarioLogado,
		usuarioId,
		nomeUsuario,
	);

	return res.status(200).json(movimentacoes);
}
