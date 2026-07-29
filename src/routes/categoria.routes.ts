import { Router } from 'express';
import * as CategoriaController from '../controllers/categoria.controller.ts';
import validate from '../middlewares/validate.middleware.ts';
import {
	createCategoriaSchema,
	updateCategoriaSchema,
} from '../schemas/categoria.schema.ts';

const router = Router();

router.get('/', CategoriaController.getAllCategoria);
router.get('/:id', CategoriaController.getCategoriaById);
router.post(
	'/',
	validate(createCategoriaSchema),
	CategoriaController.createCategoria,
);
router.put(
	'/:id',
	validate(updateCategoriaSchema),
	CategoriaController.updateCategoria,
);
router.delete('/:id', CategoriaController.deleteCategoria);

export default router;
