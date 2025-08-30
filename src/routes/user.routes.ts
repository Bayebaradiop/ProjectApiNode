import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from '../controllers/user.controller';

const router = Router();

// GET /users - Récupérer tous les utilisateurs
router.get('/', getAllUsers);

// GET /users/:id - Récupérer un utilisateur par ID
router.get('/:id', getUserById);

// POST /users - Créer un nouvel utilisateur
router.post('/', createUser);

// PUT /users/:id - Mettre à jour un utilisateur
router.put('/:id', updateUser);

// DELETE /users/:id - Supprimer un utilisateur
router.delete('/:id', deleteUser);

export default router;