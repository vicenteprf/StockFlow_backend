import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.ts';

const router = Router();

router.post('/', AuthController.login);

router.get('/google', AuthController.googleRedirect);
router.get('/google/callback', AuthController.googleCallback);

export default router;
