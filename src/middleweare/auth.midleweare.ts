
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';

// enrichir Request avec user
declare global {
	namespace Express {
		interface Request {
			user?: { id: number; email?: string; role?: string };
		}
	}
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader || !authHeader.startsWith('Bearer ')) {
			return res.status(401).json({ statut: 'error', message: 'Authentification requise', data: null });
		}

		const token = authHeader.split(' ')[1];
		let payload: any;
		try {
			payload = jwt.verify(token, JWT_SECRET);
		} catch {
			return res.status(401).json({ statut: 'error', message: 'Token invalide', data: null });
		}

		const userId = Number(payload.sub ?? payload.userId ?? payload.id);
		if (!userId) return res.status(401).json({ statut: 'error', message: 'Token invalide', data: null });

			// The schema does not have a `role` field on User; we derive a role from the related Profile.nom
			const user = await prisma.user.findUnique({
				where: { id: userId },
				select: { id: true, email: true, profile: { select: { nom: true } } },
			});

			if (!user) return res.status(401).json({ statut: 'error', message: 'Utilisateur introuvable', data: null });

			const role = user.profile?.nom ? (user.profile.nom as string).toLowerCase() : undefined;
			req.user = { id: user.id, email: user.email ?? undefined, role };
		return next();
	} catch (err) {
		console.error('authMiddleware error', err);
		return res.status(500).json({ statut: 'error', message: 'Erreur serveur', data: null });
	}
};


export const rbac = (resource?: 'parametrage' | 'users' | 'any') => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return res.status(401).json({ statut: 'error', message: 'Authentification requise', data: null });

		const role = (req.user.role ?? '').toLowerCase();
		const method = req.method.toUpperCase();

		let allowedRoles: string[] = [];

		if (method === 'GET') {
			allowedRoles = ['admin', 'formateur', 'cm'];
		} else if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
			// écriture : admin uniquement
			allowedRoles = ['admin'];
		} else {
			allowedRoles = ['admin'];
		}

		if (!allowedRoles.includes(role)) {
			return res.status(403).json({ statut: 'error', message: 'Accès refusé', data: null });
		}

		next();
	};
};

export const requireRole = (requiredRole: string) => {
	return (req: Request, res: Response, next: NextFunction) => {
		if (!req.user) return res.status(401).json({ statut: 'error', message: 'Authentification requise', data: null });
		if ((req.user.role ?? '').toLowerCase() !== requiredRole.toLowerCase()) {
			return res.status(403).json({ statut: 'error', message: 'Accès refusé', data: null });
		}
		next();
	};
};

export default authMiddleware;
