import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createUserSchema, updateUserSchema, userIdSchema, CreateUserInput, UpdateUserInput, UserIdParams } from '../../validators/user.validator';

const prisma = new PrismaClient();

// Fonction helper pour gérer les erreurs de validation Zod
const handleValidationError = (error: any, res: Response) => {
  if (error.name === 'ZodError') {
    return res.status(400).json({
      statut: "error",
      message: "Données de validation invalides",
      data: null,
      errors: error.errors.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    });
  }
  return false; // Indique que ce n'était pas une erreur de validation
};

// GET /users - Récupérer tous les utilisateurs
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        email: true,
        profileId: true,
        profilSortieId: true,
        referentielId: true,
      },
    });

    // Map the database fields to the expected response format
    const formattedUsers = users.map(user => ({
      id: user.id,
      nom: user.username, // Map username to nom
      prenom: "", // Default empty prenom
      email: user.email,
      telephone: "", // Default empty telephone
      profileId: user.profileId,
      profilSortieId: user.profilSortieId,
      referentielId: user.referentielId,
    }));

    res.status(200).json({
      statut: "success",
      message: "Liste des utilisateurs récupérée avec succès",
      data: formattedUsers,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des utilisateurs",
      data: null,
    });
  }
};

// GET /users/:id - Récupérer un utilisateur par ID
export const getUserById = async (req: Request, res: Response) => {
  try {
    // Validation des paramètres avec Zod
    const validationResult = userIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID utilisateur invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: userId } = validationResult.data.params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        profileId: true,
        profilSortieId: true,
        referentielId: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    // Map the database fields to the expected response format
    const formattedUser = {
      id: user.id,
      nom: user.username, // Map username to nom
      prenom: "", // Default empty prenom
      email: user.email,
      telephone: "", // Default empty telephone
      profileId: user.profileId,
      profilSortieId: user.profilSortieId,
      referentielId: user.referentielId,
    };

    res.status(200).json({
      statut: "success",
      message: "Utilisateur récupéré avec succès",
      data: formattedUser,
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération de l'utilisateur",
      data: null,
    });
  }
};

// POST /users - Créer un nouvel utilisateur
export const createUser = async (req: Request, res: Response) => {
  try {
    // Validation des données avec Zod
    const validationResult = createUserSchema.safeParse({ body: req.body });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "Données de validation invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { nom, prenom, email, telephone, password, profileId, profilSortieId, referentielId } = validationResult.data.body;

    const newUser = await prisma.user.create({
      data: {
        username: nom, // Map nom to username
        email,
        password, // En production, hasher le mot de passe
        profileId,
        profilSortieId,
        referentielId,
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileId: true,
        profilSortieId: true,
        referentielId: true,
      },
    });

    // Map the database fields to the expected response format
    const formattedUser = {
      id: newUser.id,
      nom: newUser.username, // Map username to nom
      prenom: prenom || "", // Use provided prenom or default
      email: newUser.email,
      telephone: telephone || "", // Use provided telephone or default
      profileId: newUser.profileId,
      profilSortieId: newUser.profilSortieId,
      referentielId: newUser.referentielId,
    };

    res.status(201).json({
      statut: "success",
      message: "Utilisateur créé avec succès",
      data: formattedUser,
    });
  } catch (error: any) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un utilisateur avec cet email existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la création de l'utilisateur",
      data: null,
    });
  }
};

// PUT /users/:id - Mettre à jour un utilisateur
export const updateUser = async (req: Request, res: Response) => {
  try {
    // Validation des paramètres et du corps de la requête avec Zod
    const validationResult = updateUserSchema.safeParse({
      params: req.params,
      body: req.body
    });

    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "Données de validation invalides",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: userId } = validationResult.data.params;
    const { nom, prenom, email, telephone, password, profileId, profilSortieId, referentielId } = validationResult.data.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nom && { username: nom }), // Map nom to username
        ...(email && { email }),
        ...(password && { password }),
        ...(profileId && { profileId }),
        ...(profilSortieId !== undefined && { profilSortieId }),
        ...(referentielId !== undefined && { referentielId }),
      },
      select: {
        id: true,
        username: true,
        email: true,
        profileId: true,
        profilSortieId: true,
        referentielId: true,
      },
    });

    // Map the database fields to the expected response format
    const formattedUser = {
      id: updatedUser.id,
      nom: updatedUser.username, // Map username to nom
      prenom: prenom || "", // Use provided prenom or default
      email: updatedUser.email,
      telephone: telephone || "", // Use provided telephone or default
      profileId: updatedUser.profileId,
      profilSortieId: updatedUser.profilSortieId,
      referentielId: updatedUser.referentielId,
    };

    res.status(200).json({
      statut: "success",
      message: "Utilisateur mis à jour avec succès",
      data: formattedUser,
    });
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);

    if (error.code === 'P2002') {
      return res.status(409).json({
        statut: "error",
        message: "Un utilisateur avec cet email existe déjà",
        data: null,
      });
    }

    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la mise à jour de l'utilisateur",
      data: null,
    });
  }
};

// DELETE /users/:id - Supprimer un utilisateur
export const deleteUser = async (req: Request, res: Response) => {
  try {
    // Validation des paramètres avec Zod
    const validationResult = userIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return res.status(400).json({
        statut: "error",
        message: "ID utilisateur invalide",
        data: null,
        errors: validationResult.error.issues.map((err: any) => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      });
    }

    const { id: userId } = validationResult.data.params;

    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existingUser) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    await prisma.user.delete({
      where: { id: userId },
    });

    res.status(200).json({
      statut: "success",
      message: "Utilisateur supprimé avec succès",
      data: null,
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la suppression de l'utilisateur",
      data: null,
    });
  }
};