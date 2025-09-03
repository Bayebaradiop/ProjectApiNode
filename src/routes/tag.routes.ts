
import { Router } from 'express';
import { createTag, deleteTag, getAllTags, getAllTagsTrieses, getTagById, updateTag } from '../controllers/tag.controller';

const router = Router();

// Routes
router.get('/sorted', getAllTagsTrieses);
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.post('/', createTag); 
router.put('/:id', updateTag); 
router.delete('/:id', deleteTag);

export default router;
