import type { Secret, SignOptions } from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

if (!secret) {
	throw new Error('A variável de ambiente JWT_SECRET não foi configurada.');
}

interface AuthConfig {
	secret: Secret;
	expiresIn: SignOptions['expiresIn'];
}

const authConfig: AuthConfig = {
	secret,
	expiresIn: '7d',
};

export default authConfig;
