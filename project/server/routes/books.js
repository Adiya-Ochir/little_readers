import express from 'express';
import { 
  getBooks, 
  getBook, 
  createBook, 
  updateBook, 
  deleteBook, 
  toggleBookStatus 
} from '../controllers/booksController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', createBook);
router.put('/:id', updateBook);
router.delete('/:id', deleteBook);
router.patch('/:id/toggle-status', toggleBookStatus);

export default router;