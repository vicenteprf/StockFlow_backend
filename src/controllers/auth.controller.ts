import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import authConfig from '../config/auth.ts';
import passport, { type GoogleAuthUser } from '../config/passport.ts';
import * as LoginService from '../services/auth.service.ts';

export async function login(req: Request, res: Response) {
	const { email, password } = req.body;

	const login = await LoginService.login(email, password);

	return res.status(200).json(login);
}

export function googleRedirect(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	passport.authenticate('google', {
		scope: ['profile', 'email'],
		session: false,
	})(req, res, next);
}

export function googleCallback(
	req: Request,
	res: Response,
	next: NextFunction,
) {
	passport.authenticate(
		'google',
		{
			session: false,
		},
		(err: Error | null, user: GoogleAuthUser | false | undefined) => {
			if (err || !user) {
				return res.status(401).json({
					error: 'Falha na autenticação com Google.',
				});
			}

			const token = jwt.sign(
				{
					id: user.id,
					email: user.email,
					name: user.name,
				},
				authConfig.secret,
				{
					expiresIn: '7d',
				},
			);

			return res.status(200).json({
				message: 'Autenticação realizado com sucesso!',
				token,
				user,
			});
		},
	)(req, res, next);
}
