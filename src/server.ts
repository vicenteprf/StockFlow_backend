import app from './app.ts';

const port = Number(process.env.PORT) || 3333;

app.listen(port, () => {
	console.log(`Servidor rodando na porta ${port}`);
});
