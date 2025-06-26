import { supabase } from '../config/database.js';

export const getBooks = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, age, search } = req.query;
    const offset = (page - 1) * limit;

    let query = supabase
      .from('books')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category && category !== 'all') {
      query = query.eq('category', category);
    }

    if (age && age !== 'all') {
      query = query.ilike('age', `%${age}%`);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%,description.ilike.%${search}%`);
    }

    const { data, error, count } = await query;

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      books: data,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        pages: Math.ceil(count / limit)
      }
    });
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ book: data });
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      created_by: req.admin.id
    };

    const { data, error } = await supabase
      .from('books')
      .insert(bookData)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({ 
      message: 'Book created successfully',
      book: data 
    });
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabase
      .from('books')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Book updated successfully',
      book: data 
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const toggleBookStatus = async (req, res) => {
  try {
    const { id } = req.params;

    // Get current status
    const { data: currentBook, error: fetchError } = await supabase
      .from('books')
      .select('is_active')
      .eq('id', id)
      .single();

    if (fetchError) {
      return res.status(404).json({ error: 'Book not found' });
    }

    // Toggle status
    const { data, error } = await supabase
      .from('books')
      .update({ is_active: !currentBook.is_active })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: `Book ${data.is_active ? 'activated' : 'deactivated'} successfully`,
      book: data 
    });
  } catch (error) {
    console.error('Toggle book status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};