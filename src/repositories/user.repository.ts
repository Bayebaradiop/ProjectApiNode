import { PrismaClient, User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';
import bcrypt from 'bcryptjs';
import { buildSearchFilter } from "../services/recherche.service";

// Types locaux pour les données de création
interface UserCreateData {
  nom: string;
  prenom?: string;
  email: string;
  telephone?: string;
  password: string;
  profileId?: number;
  profilSortieId?: number | null;
  referentielId?: number | null;
}

export class UserRepository extends BaseRepository implements IBaseRepository<User, UserCreateData> {
  constructor(prisma: PrismaClient) {
    super(prisma);
  }

  async findAll(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async findAllWithRelations(): Promise<User[]> {
    return await this.prisma.user.findMany({
      include: {
        profile: true,
        profilSortie: true,
        referentiel: true
      }
    });
  }

  async findById(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id }
    });
  }

  async findByIdWithRelations(id: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
        profilSortie: true,
        referentiel: true
      }
    });
  }

  async create(data: UserCreateData): Promise<User> {
    const { nom, email, password, profileId, profilSortieId, referentielId } = data;

    const hashedPassword = await bcrypt.hash(password, 10);

    return await this.prisma.user.create({
      data: {
        username: nom,
        email,
        password: hashedPassword,
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
      }
    } as any);
  }

  async update(id: number, data: Partial<UserCreateData>): Promise<User> {
    const updateData: any = {
      username: data.nom,
      email: data.email,
      profileId: data.profileId,
      profilSortieId: data.profilSortieId,
      referentielId: data.referentielId,
    };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return await this.prisma.user.update({
      where: { id },
      data: updateData
    });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({
      where: { id }
    });
  }

  async exists(id: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true }
    });
    return !!user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: { email }
    });
  }

  async verifyPassword(email: string, password: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email }
    });

    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

async findAllWithSearch(q?: string): Promise<User[]> {
    return await this.prisma.user.findMany({
      where: buildSearchFilter(q, ["username", "email"]), //
      include: {
        profile: true,
        profilSortie: true,
        referentiel: true,
      },
    });
  }

}


