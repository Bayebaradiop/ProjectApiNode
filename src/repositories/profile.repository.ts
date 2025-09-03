import { PrismaClient, Profile } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';
import { buildSearchFilter } from "../services/recherche.service";


// Types locaux pour les données de création
interface ProfileCreateData {
  nom: string;
  description?: string;
}

export class ProfileRepository extends BaseRepository implements IBaseRepository<Profile, ProfileCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<Profile[]> {
    return await this.prisma.profile.findMany();
  }

  async findAllWithSearch(q?: string): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      where:buildSearchFilter(q, ["nom"]),
      include: { users: true }
    });
  }

  async findAllWithRelations(): Promise<Profile[]> {
    return await this.prisma.profile.findMany({
      include: {
        users: true,
      }
    });
  }

  async findById(id: number): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<Profile | null> {
    return await this.prisma.profile.findUnique({
      where: { id },
      include: {
        users: true,
      }
    });
  }

  async create(data: ProfileCreateData): Promise<Profile> {
    return await this.prisma.profile.create({
      data,
      include: {
        users: true,
      }
    });
  }

  async update(id: number, data: Partial<ProfileCreateData>): Promise<Profile> {
    return await this.prisma.profile.update({
      where: { id },
      data
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.profile.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const profile = await this.prisma.profile.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!profile;
  }
}
