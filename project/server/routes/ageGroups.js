import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all age groups
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .order('min_age');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ ageGroups: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single age group
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('age_groups')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Age group not found' });
    }

    res.json({ ageGroup: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create age group
router.post('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('age_groups')
      .insert(req.body)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Age group created successfully',
      ageGroup: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update age group
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('age_groups')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Age group updated successfully',
      ageGroup: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete age group
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('age_groups')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Age group deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;