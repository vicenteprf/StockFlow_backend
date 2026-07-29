import type { NextFunction, Request, Response } from 'express';

interface CustomError {
	statusCode: number;
	message: string;
}

function isCustomError(error: unknown): error is CustomError {
	return (
		typeof error === 'object' &&
		error !== null &&
		'message' in error &&
		typeof (error as Record<string, unknown>).statusCode === 'number' &&
		typeof (error as Record<string, unknown>).message === 'string'
	);
}

export default function errorHandler(
	error: unknown,
	_req: Request,
	res: Response,
	_next: NextFunction,
) {
	if (isCustomError(error)) {
		res.status(error.statusCode).json({ message: error.message });
		return;
	}

	console.error(error);

	res.status(500).json({ message: 'Erro no servidor' });
}
