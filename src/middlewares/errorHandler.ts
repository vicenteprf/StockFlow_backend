import type { NextFunction, Request, Response } from 'express';
import {
	ConflictError,
	NotFoundError,
	UnauthorizedError,
} from '../errors/index.ts';

export default function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (
		error instanceof NotFoundError ||
		error instanceof ConflictError ||
		error instanceof UnauthorizedError
	) {
		res.status(error.statusCode).json({ message: error.message });
		return;
	}

	console.log(error);

	res.status(500).json({ message: 'Erro no servidor' });
}
