import type { Request, Response } from 'express';
import * as CategoriaService from '../services/categoria.service.ts';
import type { CreateCategoria, UpdateCategoria } from '../types.ts';

export async function getAllCategoria(_req: Request, res: Response) {
	const categoria = await CategoriaService.findAllCategoria();

	res.status(200).json(categoria);
}

export async function getCategoriaById(req: Request, res: Response) {
	const id = Number(req.params.id);

	const categoria = await CategoriaService.findCategoriaById(id);

	res.status(200).json(categoria);
}

export async function createCategoria(req: Request, res: Response) {
	const nome = req.body as CreateCategoria;

	const categoria = await CategoriaService.insertCategoria(nome);

	res.status(201).json(categoria);
}

export async function updateCategoria(req: Request, res: Response) {
	const id = Number(req.params.id);

	const { nome } = req.body as UpdateCategoria;

	const categoria = await CategoriaService.modifyCategoria({ id, nome });

	res.status(200).json(categoria);
}

export async function deleteCategoria(req: Request, res: Response) {
	const id = Number(req.params.id);

	await CategoriaService.removeCategoria(id);

	res.status(204).send();
}
