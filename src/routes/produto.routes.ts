import { Router } from 'express';
import * as ProdutoController from '../controllers/produto.controller.ts';
import validate from '../middlewares/validate.middleware.ts';
import {
	createProdutoSchema,
	updateProdutoSchema,
} from '../schemas/produto.schema.ts';

const router = Router();

router.get('/', ProdutoController.getAllProduto);
router.get('/:id', ProdutoController.getProdutoById);
router.post(
	'/',
	validate(createProdutoSchema),
	ProdutoController.createProduto,
);
router.put(
	'/:id',
	validate(updateProdutoSchema),
	ProdutoController.updadeProduto,
);
router.delete('/:id', ProdutoController.deleteProduto);

export default router;
