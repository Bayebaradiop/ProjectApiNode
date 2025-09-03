import { PrismaClient } from '@prisma/client';
import { UserRepository } from '../repositories';

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);

export class UserService {
  async getAllUsers() {
    return await userRepository.findAllWithRelations();
  }

  async getUserById(userId: number) {
    return await userRepository.findByIdWithRelations(userId);
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
    return await userRepository.create(data);
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
    return await userRepository.update(userId, data);
  }

  async deleteUser(userId: number) {
    await userRepository.delete(userId);
  }

  async getUserByEmail(email: string) {
    return await userRepository.findByEmail(email);
  }

  async verifyPassword(email: string, password: string) {
    return await userRepository.verifyPassword(email, password);
  }
}