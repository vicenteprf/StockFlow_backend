import { Router } from 'express';
import * as ProdutoController from '../controllers/produto.controller.ts';

const router = Router();

router.get('/', ProdutoController.getAllProduto);
router.get('/:id', ProdutoController.getProdutoById);
router.post('/', ProdutoController.createProduto);
router.put('/:id', ProdutoController.updadeProduto);
router.delete('/:id', ProdutoController.deleteProduto);

export default router;
