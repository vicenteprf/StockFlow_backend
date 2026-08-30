import type { Request, Response } from 'express';
import type { CreateUsuario } from '../schemas/usuario.schema.ts';
import * as UsuarioService from '../services/usuario.service.ts';

export async function getAllUsuario(req: Request, res: Response) {
	const usuario = await UsuarioService.findAllUsuarioDaEquipe(req.id!);

	res.status(200).json(usuario);
}

export async function getUsuarioById(req: Request, res: Response) {
	const id = Number(req.params.id);

	const usuario = await UsuarioService.findUsuarioById(id);

	res.status(200).json(usuario);
}

export async function createUsuario(req: Request, res: Response) {
	const { nome, empresa, email, role, password } = req.body as CreateUsuario;

	const dados = await UsuarioService.insertUsuario({
		nome,
		empresa,
		email,
		role,
		password,
	});

	res.status(201).json(dados);
}

export async function deleteUsuario(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	await UsuarioService.removeUsuario(id, usuarioLogado);

	res.status(204).send();
}

export async function convidarMembro(req: Request, res: Response) {
	const novoMembro = await UsuarioService.convidarMembro({
		...req.body,
		adminId: req.id,
	});

	res.status(201).json(novoMembro);
}
