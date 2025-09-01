import { PrismaClient, User } from '@prisma/client';
import { BaseRepository } from './base.repository';
import { IBaseRepository } from '../interfaces';

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

    return await this.prisma.user.create({
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
      }
    } as any);
  }

  async update(id: number, data: Partial<UserCreateData>): Promise<User> {
    return await this.prisma.user.update({
      where: { id },
      data: {
        username: data.nom,
        email: data.email,
        password: data.password,
        profileId: data.profileId,
        profilSortieId: data.profilSortieId,
        referentielId: data.referentielId,
      }
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
}
