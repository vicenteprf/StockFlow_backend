import type { CorsOptions } from 'cors';

const allowedOrigins = [
	'https://stock-flow-frontend-omega.vercel.app',
	'http://localhost:5173',
	'http://127.0.0.1:5173',
];

export const corsOptions: CorsOptions = {
	origin: (origin, callback) => {
		if (!origin || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(null, true);
		}
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
	],
	credentials: true,
	optionsSuccessStatus: 200,
};
