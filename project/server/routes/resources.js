import express from 'express';
import { supabase } from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { type, category } = req.query;
    
    let query = supabase
      .from('resources')
      .select('*')
      .order('created_at', { ascending: false });

    if (type) {
      query = query.eq('type', type);
    }

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ resources: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single resource
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('resources')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Resource not found' });
    }

    res.json({ resource: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create resource
router.post('/', async (req, res) => {
  try {
    const resourceData = {
      ...req.body,
      created_by: req.admin.id
    };

    const { data, error } = await supabase
      .from('resources')
      .insert(resourceData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Resource created successfully',
      resource: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update resource
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('resources')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Resource updated successfully',
      resource: data 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete resource
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('resources')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Track download
router.post('/:id/download', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Increment download count
    const { data, error } = await supabase
      .rpc('increment_download_count', { resource_id: id });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Download tracked successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;