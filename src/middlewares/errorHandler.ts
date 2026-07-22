import type { NextFunction, Request, Response } from 'express';
import { ConflictError, NotFoundError } from '../errors/index.ts';

export default function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (error instanceof NotFoundError) {
		res.status(error.statusCode).json({ message: error.message });
		return;
	}

	if (error instanceof ConflictError) {
		res.status(error.statusCode).json({ message: error.message });
		return;
	}

	console.log(error);

	res.status(500).json({ message: 'Erro no servidor' });
}
