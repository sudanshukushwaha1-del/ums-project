import { Request, Response, NextFunction } from 'express';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);
const prisma = new PrismaClient();

export interface AuthRequest extends Request {
  user?: any;
  userRole?: string;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return res.status(401).json({ error: 'Invalid token' });
  }

  if (!data.user.email) {
    return res.status(400).json({ error: 'User email not found in token' });
  }

  // Fetch role from database
  try {
    const dbUser = await prisma.user.findUnique({
      where: { email: data.user.email },
    });

    if (!dbUser) {
      return res.status(404).json({ error: 'User not found in database' });
    }

    req.user = data.user;
    req.userRole = dbUser.role;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
};
