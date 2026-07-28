import { Router } from 'express';
import * as UsuarioController from '../controllers/usuario.controller.ts';

const router = Router();

router.get('/', UsuarioController.getAllUsuario);
router.get('/:id', UsuarioController.getUsuarioById);
router.post('/', UsuarioController.createUsuario);

export default router;
