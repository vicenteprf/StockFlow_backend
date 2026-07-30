import express from 'express';
import authMiddleware from './middlewares/auth.middlewares.ts';
import errorHandler from './middlewares/errorHandler.ts';
import AuthRouter from './routes/auth.routes.ts';
import CategoriaRouter from './routes/categoria.routes.ts';
import MovimentacaoRoutes from './routes/movimentacao.routes.ts';
import ProdutoRouter from './routes/produto.routes.ts';
import UsuarioRouter from './routes/usuario.routes.ts';

const app = express();

app.use(express.json());

app.use('/categoria', authMiddleware, CategoriaRouter);

app.use('/produto', authMiddleware, ProdutoRouter);

app.use('/usuario', authMiddleware, UsuarioRouter);

app.use('/auth', AuthRouter);

app.use('/movimentacao', MovimentacaoRoutes);

app.use((_req, res) => {
	res.status(404).json({
		message: 'Not found!.',
	});
});

app.use(errorHandler);

app.listen(Number(process.env.PORT));
