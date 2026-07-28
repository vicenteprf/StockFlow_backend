import type { Request, Response } from 'express';
import * as UsuarioService from '../services/usuario.service.ts';
import type { CreateUsuario } from '../types.ts';

export async function getAllUsuario(_req: Request, res: Response) {
	const usuario = await UsuarioService.findAllUsuario();

	res.status(200).json(usuario);
}

export async function getUsuarioById(req: Request, res: Response) {
	const id = Number(req.params.id);

	const usuario = await UsuarioService.findUsuarioById(id);

	res.status(200).json(usuario);
}

export async function createUsuario(req: Request, res: Response) {
	const { name, email, password } = req.body as CreateUsuario;

	const usuario = await UsuarioService.insertUsuario({
		name,
		email,
		password,
	});

	res.status(201).json(usuario);
}
