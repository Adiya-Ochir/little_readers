import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all reading tips
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reading_tips')
      .select('*')
      .order('sort_order');

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ readingTips: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single reading tip
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('reading_tips')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Reading tip not found' });
    }

    res.json({ readingTip: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create reading tip
router.post('/', async (req, res) => {
  try {
    const readingTipData = {
      ...req.body,
      created_by: req.admin.id
    };

    const { data, error } = await supabase
      .from('reading_tips')
      .insert(readingTipData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Reading tip created successfully',
      readingTip: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update reading tip
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('reading_tips')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Reading tip updated successfully',
      readingTip: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete reading tip
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('reading_tips')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Reading tip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;