import express from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../config/database.js';
import { authenticateToken, requireSuperAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all admins (Super Admin only)
router.get('/', requireSuperAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, name, role, is_active, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ admins: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single admin (Super Admin only)
router.get('/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('admins')
      .select('id, email, name, role, is_active, created_at, updated_at')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json({ admin: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create admin (Super Admin only)
router.post('/', requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, name, role = 'admin' } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    const { data, error } = await supabase
      .from('admins')
      .insert({ email, password_hash, name, role })
      .select('id, email, name, role, is_active, created_at, updated_at')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Admin created successfully',
      admin: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update admin (Super Admin only)
router.put('/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { email, name, role, is_active } = req.body;
    
    const updateData = { email, name, role, is_active };

    const { data, error } = await supabase
      .from('admins')
      .update(updateData)
      .eq('id', id)
      .select('id, email, name, role, is_active, created_at, updated_at')
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Admin updated successfully',
      admin: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete admin (Super Admin only)
router.delete('/:id', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Don't allow deleting self
    if (id === req.admin.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }
    
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset admin password (Super Admin only)
router.post('/:id/reset-password', requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ error: 'New password is required' });
    }

    // Hash new password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(newPassword, saltRounds);

    const { error } = await supabase
      .from('admins')
      .update({ password_hash })
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;