
import { Router } from 'express';
import { createTag, deleteTag, getAllTags, getTagById, updateTag } from '../controllers/tag.controller';

const router = Router();

// Routes
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.post('/', createTag); 
router.put('/:id', updateTag); 
router.delete('/:id', deleteTag);

export default router;
