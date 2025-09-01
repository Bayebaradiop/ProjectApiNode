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

  verifyAccessToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_ACCESS_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as TokenPayload;
    } catch (error) {
      return null;
    }
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
      // Token expired, remove it
      await prisma.refreshToken.delete({
        where: { token },
      });
      return false;
    }

    return true;
  }

  async removeRefreshToken(token: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { token },
    });
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

    // Store refresh token
    await this.storeRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async refreshAccessToken(refreshToken: string): Promise<string | null> {
    const isValid = await this.validateRefreshToken(refreshToken);

    if (!isValid) return null;

    const payload = this.verifyRefreshToken(refreshToken);

    if (!payload) return null;

    // Generate new access token
    return this.generateAccessToken(payload);
  }
}