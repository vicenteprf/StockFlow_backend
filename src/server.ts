import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors.ts';
import passport from './config/passport.ts';
import authMiddleware from './middlewares/auth.middlewares.ts';
import errorHandler from './middlewares/errorHandler.ts';
import AuthRouter from './routes/auth.routes.ts';
import CategoriaRouter from './routes/categoria.routes.ts';
import MovimentacaoRoutes from './routes/movimentacao.routes.ts';
import ProdutoRouter from './routes/produto.routes.ts';
import UsuarioRouter from './routes/usuario.routes.ts';

const app = express();

app.use(cors(corsOptions));

app.use(express.json());

app.use(passport.initialize());

app.use('/categoria', authMiddleware, CategoriaRouter);

app.use('/produto', authMiddleware, ProdutoRouter);

app.use('/usuario', UsuarioRouter);

app.use('/auth', AuthRouter);

app.use('/movimentacao', MovimentacaoRoutes);

app.use((_req, res) => {
	res.status(404).json({
		message: 'Not found!.',
	});
});

app.use(errorHandler);

if (process.env.NODE_ENV !== 'production') {
	const PORT = Number(process.env.PORT);
	app.listen(PORT);
}

export default app;
