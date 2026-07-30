import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.ts';
import { UnauthorizedError } from '../errors/index.ts';
import type { TokenPayload } from '../Types/types.ts';

export default async function authMiddleware(
	req: Request,
	_res: Response,
	next: NextFunction,
) {
	const token = req.headers.authorization?.split(' ')[1];

	if (!token) {
		return next(new UnauthorizedError('Não autorizado.'));
	}

	try {
		const validacao = jwt.verify(token, authConfig.secret) as TokenPayload;

		req.id = validacao.id;

		return next();
	} catch {
		return next(new UnauthorizedError('Token inválido.'));
	}
}
