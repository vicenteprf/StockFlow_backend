import { prisma } from '../data/cliente.Prisma.ts';
import { NotFoundError, UnauthorizedError } from '../errors/index.ts';

export async function getAdminIdBase(usuarioLogadoId: number): Promise<number> {
	if (!usuarioLogadoId) {
		throw new UnauthorizedError('Usuário não autenticado.');
	}

	const usuarioLogado = await prisma.usuario.findUnique({
		where: { id: usuarioLogadoId },
		select: { id: true, role: true, adminId: true },
	});

	if (!usuarioLogado) {
		throw new NotFoundError('Usuário não encontrado.');
	}

	const adminIdBase =
		usuarioLogado.role === 'ADMIN' ? usuarioLogado.id : usuarioLogado.adminId;

	if (!adminIdBase) {
		throw new UnauthorizedError(
			'Usuário não está vinculado a nenhuma equipe ou admin.',
		);
	}

	return adminIdBase;
}
