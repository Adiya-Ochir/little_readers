import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('label');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ categories: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Category not found' });
    }

    res.json({ category: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create category
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Category created successfully',
      category: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('categories')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Category updated successfully',
      category: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;