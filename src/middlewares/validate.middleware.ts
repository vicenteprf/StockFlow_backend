import type { NextFunction, Request, Response } from 'express';
import type { ZodType } from 'zod';
import { UnprocessableEntityError } from '../errors/index.ts';

export default function validate(schema: ZodType) {
	return (req: Request, _res: Response, next: NextFunction) => {
		const result = schema.safeParse(req.body);

		if (!result.success) {
			return next(new UnprocessableEntityError(result.error.issues[0].message));
		}

		req.body = result.data;

		next();
	};
}
