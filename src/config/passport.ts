import passport from 'passport';
import {
	Strategy as GoogleStrategy,
	type Profile,
	type VerifyCallback,
} from 'passport-google-oauth20';
import { prisma } from '../data/cliente.Prisma.ts';

const clientID = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackURL = process.env.CALLBACK_URL;

if (!clientID || !clientSecret || !callbackURL) {
	throw new Error(
		'Variáveis de ambiente ausentes: Certifique-se de que GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET e CALLBACK_URL estejam configuradas no .env',
	);
}

export interface GoogleAuthUser {
	id: number;
	email: string;
	name: string;
	avatarUrl?: string;
}

passport.use(
	new GoogleStrategy(
		{
			clientID,
			clientSecret,
			callbackURL,
		},
		async (
			_accessToken: string,
			_refreshToken: string,
			profile: Profile,
			done: VerifyCallback,
		) => {
			try {
				const email = profile.emails?.[0]?.value;

				if (!email) {
					return done(
						new Error('Nenhum email retornado pela conta do Google.'),
						undefined,
					);
				}

				const name =
					profile.displayName || profile.name?.givenName || 'Usuário';
				const avatarUrl = profile.photos?.[0].value;

				let user = await prisma.usuario.findUnique({
					where: {
						email,
					},
				});

				if (!user) {
					user = await prisma.usuario.create({
						data: {
							email,
							name,
							avatarUrl,
							googleId: profile.id,
						},
					});
				} else if (!user.googleId) {
					user = await prisma.usuario.update({
						where: { id: user.id },
						data: { googleId: profile.id },
					});
				}

				const authUsuario: GoogleAuthUser = {
					id: user.id,
					email: user.email,
					name: user.name,
					avatarUrl: user.avatarUrl ?? undefined,
				};

				return done(null, authUsuario);
			} catch (error) {
				return done(error as Error, undefined);
			}
		},
	),
);

export default passport;
