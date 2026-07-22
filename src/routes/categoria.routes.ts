import { Router } from 'express';
import * as CategoriaController from '../controllers/categoria.controller.ts';

const router = Router();

router.get('/', CategoriaController.getAllCategoria);
router.get('/:id', CategoriaController.getCategoriaById);
router.post('/', CategoriaController.createCategoria);
router.put('/:id', CategoriaController.updateCategoria);
router.delete('/:id', CategoriaController.deleteCategoria);

export default router;
