import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { Role } from '@prisma/client';
import { env } from './env.js';
import { prisma } from './prisma.js';

type JwtPayload = {
  sub: string;
  role: Role;
};

export const authCookieName = 'workspace_token';

export function signToken(user: { id: number; role: Role }) {
  return jwt.sign({ sub: String(user.id), role: user.role }, env.jwtSecret, {
    expiresIn: '7d',
  });
}

export function setAuthCookie(res: Response, token: string) {
  res.cookie(authCookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/',
  });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(authCookieName, { path: '/' });
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[authCookieName];
  if (!token) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwtSecret) as JwtPayload;
    const id = Number(payload.sub);
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, role: true },
    });

    if (!user) {
      clearAuthCookie(res);
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    req.auth = user;
    next();
  } catch {
    clearAuthCookie(res);
    res.status(401).json({ message: 'Authentication required' });
  }
}

export function requireRole(role: Role) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.auth) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (req.auth.role !== role) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    next();
  };
}
