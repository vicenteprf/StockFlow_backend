import { Router } from 'express';
import * as AuthController from '../controllers/login.controller.ts';

const router = Router();

router.post('/', AuthController.login);

export default router;
