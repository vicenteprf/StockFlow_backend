import { Router } from 'express';
import {
	criarMovimentacaoController,
	getMovimentacoes,
	movimentacaoEntradaLote,
} from '../controllers/movimentacao.controller.ts';
import authMiddleware from '../middlewares/auth.middlewares.ts';
import validate from '../middlewares/validate.middleware.ts';
import {
	entradaDeProdutos,
	registrarMovimentacaoSchema,
} from '../schemas/movimentacao.schema.ts';

const movimentacaoRoutes = Router();

movimentacaoRoutes.use(authMiddleware);

movimentacaoRoutes.post(
	'/',
	validate(registrarMovimentacaoSchema),
	criarMovimentacaoController,
);

movimentacaoRoutes.get('/', getMovimentacoes);

movimentacaoRoutes.post(
	'/entrada',
	validate(entradaDeProdutos),
	movimentacaoEntradaLote,
);

export default movimentacaoRoutes;
