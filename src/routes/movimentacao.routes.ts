import { Router } from 'express';
import { criarMovimentacaoController } from '../controllers/movimentacao.controller.ts';
import authMiddleware from '../middlewares/auth.middlewares.ts';
import validate from '../middlewares/validate.middleware.ts';
import { registrarMovimentacaoSchema } from '../schemas/movimentacao.schema.ts';

const movimentacaoRoutes = Router();

movimentacaoRoutes.post(
	'/',
	authMiddleware,
	validate(registrarMovimentacaoSchema),
	criarMovimentacaoController,
);

export default movimentacaoRoutes;
