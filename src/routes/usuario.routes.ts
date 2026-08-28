import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.ts';
import authMiddleware from '../middlewares/auth.middlewares.ts';
import validate from '../middlewares/validate.middleware.ts';
import { createUsuarioSchema } from '../schemas/usuario.schema.ts';

const router = Router();

router.get('/', authMiddleware, UsuarioController.getAllUsuario);
router.get('/:id', authMiddleware, UsuarioController.getUsuarioById);
router.post(
	'/',
	validate(createUsuarioSchema),
	UsuarioController.createUsuario,
);
router.post(
	'/convite',
	authMiddleware,
	validate(createUsuarioSchema),
	UsuarioController.convidarMembro,
);
router.delete('/:id', authMiddleware, UsuarioController.deleteUsuario);

export default router;
