
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { rbac, requireRole } from '../dictionnaire/role.dictionary';

const prisma = new PrismaClient();
// prefer explicit access token secret if present
const JWT_SECRET = process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || 'change_me';

// Typages utiles
type JwtPayload = { sub?: string | number; userId?: number; id?: number; iat?: number; exp?: number };
type RequestUser = { id: number; email?: string; role?: string };

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

			// extract and sanitize token: remove surrounding quotes, CR/LF and trim
			let rawToken = (authHeader.split(' ')[1] ?? '').toString();
			rawToken = rawToken.replace(/^['"]|['"]$/g, '').replace(/\r|\n/g, '').trim();

			// quick JWT basic format check (header.payload.signature)
			const jwtFormat = /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/;
			if (!jwtFormat.test(rawToken)) {
				console.warn('authMiddleware: malformed Authorization token', { snippet: rawToken.slice(0, 40) });
				return res.status(401).json({ statut: 'error', message: 'Token invalide', data: null });
			}

			let payload: JwtPayload;
			try {
				payload = jwt.verify(rawToken, JWT_SECRET) as JwtPayload;
			} catch (e) {
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


// rbac and requireRole moved to src/dictionnaire/role.dictionary.ts

export default authMiddleware;
