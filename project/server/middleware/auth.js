import jwt from 'jsonwebtoken';
import { supabase } from '../config/database.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Verify admin exists and is active
    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('id', decoded.id)
      .eq('is_active', true)
      .single();

    if (error || !admin) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(403).json({ error: 'Invalid token' });
  }
};

export const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required' });
  }
  next();
};