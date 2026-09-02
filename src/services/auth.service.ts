import crypto from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import authConfig from '../config/auth.ts';
import { prisma } from '../data/cliente.Prisma.ts';
import {
	NotFoundError,
	UnauthorizedError,
	UnprocessableEntityError,
} from '../errors/index.ts';

const SALT_ROUNDS = 10;

export async function login(email: string, password: string) {
	const usuario = await prisma.usuario.findUnique({
		where: {
			email,
		},
	});

	if (!usuario || !usuario.password) {
		throw new UnauthorizedError('Credenciais inválidas.');
	}

	const { id, nome } = usuario;

	const senhaValida = await bcrypt.compare(password, usuario.password);

	if (!senhaValida) {
		throw new UnauthorizedError('Credenciais inválidas.');
	}

	const token = jwt.sign({ id }, authConfig.secret, {
		expiresIn: authConfig.expiresIn,
	});

	return {
		usuario: {
			id,
			nome,
			email,
		},
		token,
	};
}

export async function esqueceuSenha(email: string): Promise<void> {
	const usuario = await prisma.usuario.findUnique({
		where: {
			email,
		},
	});

	if (!usuario) return;

	const token = crypto.randomBytes(20).toString('hex');

	const expiresToken = new Date();
	expiresToken.setMinutes(expiresToken.getMinutes() + 15);

	await prisma.usuario.update({
		where: {
			id: usuario.id,
		},
		data: {
			resetToken: token,
			resetTokenExpira: expiresToken,
		},
	});

	const resetarSenhaUrl = `${process.env.FRONTEND_URL}/redefinir-senha?token=${token}`;

	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 465,
		secure: true,
		auth: {
			user: process.env.EMAIL_USER,
			pass: process.env.EMAIL_PASS,
		},
	});

	await transporter.sendMail({
		from: `StockFlow <${process.env.EMAIL_USER}>`,
		to: email,
		subject: 'Recuperação de Senha - StockFlow',
		html: `
         <div style="font-family: sans-serif; max-width: 600px; color: #333;">
            <h2>Olá, ${usuario.nome}!</h2>
            <p>Você solicitou a redefinição de senha para sua conta no Controle de Tarefas.</p>
            <p>Para escolher uma nova senha, clique no botão abaixo:</p>
            <a href="${resetarSenhaUrl}" style="background-color: #2563eb; color: white; padding: 12px 20px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; margin: 15px 0;">Redefinir Senha</a>
            <p style="font-size: 12px; color: #666;">Este link é válido por 15 minutos. Se você não solicitou essa alteração, ignore este e-mail.</p>
          </div> 
          `,
	});
}

export async function redefinirSenha(token: string, senha: string) {
	const usuario = await prisma.usuario.findFirst({
		where: {
			resetToken: token,
		},
	});

	if (!usuario || !usuario.resetTokenExpira) {
		throw new NotFoundError('O link de redefinição é invalido ou expirou.');
	}

	const verificacaoToken = new Date();
	if (verificacaoToken > usuario.resetTokenExpira) {
		throw new NotFoundError('O link expirou. Solicite uma nova recuperação.');
	}

	if (senha.length < 6) {
		throw new UnprocessableEntityError(
			'A senha deve conter no mínimo 6 caracteres.',
		);
	}

	const hashPasswort = await bcrypt.hash(senha, SALT_ROUNDS);

	await prisma.usuario.update({
		where: {
			id: usuario.id,
		},
		data: {
			password: hashPasswort,
			resetToken: null,
			resetTokenExpira: null,
		},
	});
}
