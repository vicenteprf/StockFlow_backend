import type { Request, Response } from 'express';
import * as ProdutoService from '../services/produto.service.ts';
import type { CreateProduto, UpdateProduto } from '../types.ts';

export async function getAllProduto(_req: Request, res: Response) {
	const produto = await ProdutoService.findAllProdutos();

	res.status(200).json(produto);
}

export async function getProdutoById(req: Request, res: Response) {
	const id = Number(req.params.id);

	const produto = await ProdutoService.findProdutoById(id);

	res.status(200).json(produto);
}

export async function createProduto(req: Request, res: Response) {
	const { nome, descricao, preco, quantidade, validade, categoria } =
		req.body as CreateProduto;

	const produto = await ProdutoService.insertProduto({
		nome,
		descricao,
		preco,
		quantidade,
		validade,
		categoria,
	});

	res.status(201).json(produto);
}

export async function updadeProduto(req: Request, res: Response) {
	const id = Number(req.params.id);

	const { nome, descricao, preco, quantidade, validade, categoria } =
		req.body as UpdateProduto;

	const produto = await ProdutoService.modifyProduto({
		id,
		nome,
		descricao,
		preco,
		quantidade,
		validade,
		categoria,
	});

	res.status(200).json(produto);
}

export async function deleteProduto(req: Request, res: Response) {
	const id = Number(req.params.id);

	await ProdutoService.removeProduto(id);

	res.status(204).send();
}
