import type { Request, Response } from 'express';
import type {
	CreateCategoria,
	UpdateCategoria,
} from '../schemas/categoria.schema.ts';
import * as CategoriaService from '../services/categoria.service.ts';

export async function getAllCategoria(req: Request, res: Response) {
	const usuarioLogado = Number(req.id);
	const categorias = await CategoriaService.findAllCategoria(usuarioLogado);

	res.status(200).json(categorias);
}

export async function getCategoriaById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	const categoria = await CategoriaService.findCategoriaById(id, usuarioLogado);

	res.status(200).json(categoria);
}

export async function createCategoria(req: Request, res: Response) {
	const { nome } = req.body as CreateCategoria;
	const usuarioLogado = Number(req.id);

	const categoria = await CategoriaService.insertCategoria(
		{ nome },
		usuarioLogado,
	);

	res.status(201).json(categoria);
}

export async function updateCategoria(req: Request, res: Response) {
	const id = Number(req.params.id);
	const { nome } = req.body as UpdateCategoria;
	const usuarioLogado = Number(req.id);

	const categoria = await CategoriaService.modifyCategoria(
		id,
		{ nome },
		usuarioLogado,
	);

	res.status(200).json(categoria);
}

export async function deleteCategoria(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	await CategoriaService.removeCategoria(id, usuarioLogado);

	res.status(204).send();
}
