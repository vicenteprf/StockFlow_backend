import type { Request, Response } from 'express';
import * as LoginService from '../services/auth.service.ts';

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	const login = await LoginService.login(email, password);

	return res.status(200).json(login);
}
