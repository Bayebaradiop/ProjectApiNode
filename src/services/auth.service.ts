import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import { UserService } from './user.service';

const prisma = new PrismaClient();
const userService = new UserService();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'default-access-secret';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'default-refresh-secret';

export interface TokenPayload {
  userId: number;
  email: string;
}

export class AuthService {
  generateAccessToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_ACCESS_SECRET, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: TokenPayload): string {
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: '24h' });
  }

  verifyAccessToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as jwt.JwtPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): jwt.JwtPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as jwt.JwtPayload;
    } catch (error) {
      return null;
    }
  }

  private extractTokenPayload(payload: jwt.JwtPayload): TokenPayload | null {
    if (!payload.userId || !payload.email) return null;
    return {
      userId: payload.userId,
      email: payload.email,
    };
  }

  async storeRefreshToken(userId: number, token: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    await prisma.refreshToken.create({
      data: {
        token,
        userId,
        expiresAt,
      },
    });
  }

  async validateRefreshToken(token: string): Promise<boolean> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
    });

    if (!refreshToken) return false;

    if (refreshToken.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { token } });
      return false;
    }

    return true;
  }

  async removeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { token } });
  }

  async login(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await userService.verifyPassword(email, password);
    if (!user) return null;

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
    };

    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);

    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const isValid = await this.validateRefreshToken(refreshToken);
    if (!isValid) return null;

    const decoded = this.verifyRefreshToken(refreshToken);
    if (!decoded) return null;

    const payload = this.extractTokenPayload(decoded);
    if (!payload) return null;

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) return null;

    const newAccessToken = this.generateAccessToken(payload);
    const newRefreshToken = this.generateRefreshToken(payload);

    await this.removeRefreshToken(refreshToken);
    await this.storeRefreshToken(tokenRecord.userId, newRefreshToken);

    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
  }
}
