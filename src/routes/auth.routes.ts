import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

router.post('/', AuthController.login);

router.get('/google', AuthController.googleRedirect);
router.get('/google/callback', AuthController.googleCallback);
router.post('/esqueceu-senha', AuthController.esqueceuSenha);
router.post('/redefinir-senha', AuthController.redefinirSenha);

export default router;
