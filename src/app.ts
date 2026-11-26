import cors from 'cors';
import express from 'express';
import { corsOptions } from './config/cors.ts';
import passport from './config/passport.ts';
import { prisma } from './data/cliente.Prisma.ts';
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

app.get('/health', async (_req, res) => {
	try {
		await prisma.$queryRaw`SELECT 1;`;

		res.status(200).json({
			server: 'servidor disponível.',
			database: 'banco de dados disponível.',
		});
	} catch (e) {
		console.error(e);

		res.status(500).json({
			server: 'servidor disponível.',
			database: 'banco de dados indisponível.',
		});
	}
});

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

export default app;
