import { Request, Response, NextFunction } from 'express';

/**
 * Dictionnaire et middlewares RBAC centralisés.
 * - Lecture (GET) : admin, formateur, cm
 * - Ecriture (POST/PUT/DELETE/PATCH) : admin
 */
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

export default {
  rbac,
  requireRole,
};
