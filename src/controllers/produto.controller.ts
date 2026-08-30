import type { Request, Response } from 'express';
import type {
	CreateProduto,
	UpdateProduto,
} from '../schemas/produto.schema.ts';
import * as ProdutoService from '../services/produto.service.ts';

export async function getAllProduto(req: Request, res: Response) {
	const usuarioLogado = Number(req.id);
	const produto = await ProdutoService.findAllProdutos(usuarioLogado);

	res.status(200).json(produto);
}

export async function getProdutoById(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	const produto = await ProdutoService.findProdutoById(id, usuarioLogado);

	res.status(200).json(produto);
}

export async function createProduto(req: Request, res: Response) {
	const { nome, descricao, categoriaId } = req.body as CreateProduto;
	const usuarioLogado = Number(req.id);

	const produto = await ProdutoService.insertProduto(
		{
			nome,
			descricao,
			categoriaId,
		},
		usuarioLogado,
	);

	res.status(201).json(produto);
}

export async function updadeProduto(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	const { nome, descricao, categoriaId } = req.body as UpdateProduto;

	const produto = await ProdutoService.modifyProduto(
		id,
		{
			nome,
			descricao,
			categoriaId,
		},
		usuarioLogado,
	);

	res.status(200).json(produto);
}

export async function deleteProduto(req: Request, res: Response) {
	const id = Number(req.params.id);
	const usuarioLogado = Number(req.id);

	await ProdutoService.removeProduto(id, usuarioLogado);

	res.status(204).send();
}
