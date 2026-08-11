import type { CorsOptions } from 'cors';

export const corsOptions: CorsOptions = {
	origin: [
		'http://localhost:5173',
		// "https://seu-frontend.vercel.app",
	],
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	credentials: true,
	optionsSuccessStatus: 200,
};
