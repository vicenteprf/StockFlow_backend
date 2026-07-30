import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.ts';
import validate from '../middlewares/validate.middleware.ts';
import { createUsuarioSchema } from '../schemas/usuario.schema.ts';

const router = Router();

router.get('/', UsuarioController.getAllUsuario);
router.get('/:id', UsuarioController.getUsuarioById);
router.post(
	'/',
	validate(createUsuarioSchema),
	UsuarioController.createUsuario,
);

export default router;
