export class NotFoundError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.statusCode = 404;
	}
}

export class ConflictError extends Error {
	statusCode: number;

	constructor(message: string) {
		super(message);
		this.statusCode = 409;
	}
}
