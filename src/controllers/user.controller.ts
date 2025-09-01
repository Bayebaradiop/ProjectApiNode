import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { createUserSchema, updateUserSchema, userIdSchema, CreateUserInput, UpdateUserInput, UserIdParams } from '../validators/user.validator';
import { handleValidationError } from '../utils/validation.utils';

const userService = new UserService();


export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();

    res.status(200).json({
      statut: "success",
      message: "Liste des utilisateurs récupérée avec succès",
      data: users,
    });
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs:", error);
    res.status(500).json({
      statut: "error",
      message: "Erreur lors de la récupération des utilisateurs",
      data: null,
    });
  }
};





export const getUserById = async (req: Request, res: Response) => {
  try {
    const validationResult = userIdSchema.safeParse({ params: req.params });
    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const { id: userId } = validationResult.data.params;
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    res.status(200).json({
      statut: "success",
      message: "Utilisateur récupéré avec succès",
      data: user,
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
      return handleValidationError(validationResult.error, res);
    }

    const { nom, prenom, email, telephone, password, profileId, profilSortieId, referentielId } = validationResult.data.body;

    const newUser = await userService.createUser({
      nom,
      prenom,
      email,
      telephone,
      password,
      profileId,
      profilSortieId,
      referentielId,
    });


    // // Map the database fields to the expected response format
    // const formattedUser = {
    //   id: newUser.id,
    //   nom: newUser.username, // Map username to nom
    //   prenom: prenom || "", // Use provided prenom or default
    //   email: newUser.email,
    //   telephone: telephone || "", // Use provided telephone or default
    //   profileId: newUser.profileId,
    //   profilSortieId: newUser.profilSortieId,
    //   referentielId: newUser.referentielId,
    // };

    res.status(201).json({
      statut: "success",
      message: "Utilisateur créé avec succès",
      data: newUser,
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
    const validationResult = updateUserSchema.safeParse({
      params: req.params,
      body: req.body
    });

    if (!validationResult.success) {
      return handleValidationError(validationResult.error, res);
    }

    const { id: userId } = validationResult.data.params;
    const { nom, prenom, email, telephone, password, profileId, profilSortieId, referentielId } = validationResult.data.body;

    // Vérifier si l'utilisateur existe
    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    const updatedUser = await userService.updateUser(userId, {
      nom,
      prenom,
      email,
      telephone,
      password,
      profileId,
      profilSortieId,
      referentielId,
    });

    // // Map the database fields to the expected response format
    // const formattedUser = {
    //   id: updatedUser.id,
    //   nom: updatedUser.username, // Map username to nom
    //   prenom: prenom || "", // Use provided prenom or default
    //   email: updatedUser.email,
    //   telephone: telephone || "", // Use provided telephone or default
    //   profileId: updatedUser.profileId,
    //   profilSortieId: updatedUser.profilSortieId,
    //   referentielId: updatedUser.referentielId,
    // };

    res.status(200).json({
      statut: "success",
      message: "Utilisateur mis à jour avec succès",
      data: updatedUser,
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
      return handleValidationError(validationResult.error, res);
    }

    const { id: userId } = validationResult.data.params;

    // Vérifier si l'utilisateur existe
    const existingUser = await userService.getUserById(userId);

    if (!existingUser) {
      return res.status(404).json({
        statut: "error",
        message: "Utilisateur non trouvé",
        data: null,
      });
    }

    await userService.deleteUser(userId);

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