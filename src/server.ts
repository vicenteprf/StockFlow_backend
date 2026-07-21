import express from 'express';

const app = express();

app.use(express.json());

app.use((_req, res) => {
	res.status(404).json({
		message: 'Not found!.',
	});
});

app.listen(Number(process.env.PORT));
