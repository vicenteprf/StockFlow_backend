import express from 'express';
import errorHandler from './middlewares/errorHandler.ts';
import CategoriaRouter from './routes/categoria.routes.ts';

const app = express();

app.use(express.json());

app.use('/categoria', CategoriaRouter);

app.use((_req, res) => {
	res.status(404).json({
		message: 'Not found!.',
	});
});

app.use(errorHandler);

app.listen(Number(process.env.PORT));
