import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      include: {
        profile: true,
        profilSortie: true,
        referentiel: true
      }
    });
  }

  async getUserById(userId: number) {
    return await prisma.user.findUnique({
      where: { id: userId },
    });
  }

  async createUser(data: {
    nom: string;
    prenom?: string;
    email: string;
    telephone?: string;
    password: string;
    profileId: number;
    profilSortieId?: number;
    referentielId?: number;
  }) {
    const { nom, email, password, profileId, profilSortieId, referentielId } = data;

    return await prisma.user.create({
      data: {
        username: nom,
        email,
        password,
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
  }

  async updateUser(userId: number, data: {
    nom?: string;
    prenom?: string;
    email?: string;
    telephone?: string;
    password?: string;
    profileId?: number;
    profilSortieId?: number | null;
    referentielId?: number | null;
  }) {
    const { nom, email, password, profileId, profilSortieId, referentielId } = data;

    return await prisma.user.update({
      where: { id: userId },
      data: {
        ...(nom && { username: nom }),
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
  }

  async deleteUser(userId: number) {
    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
