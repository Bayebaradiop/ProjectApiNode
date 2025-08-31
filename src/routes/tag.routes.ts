
import { Router } from 'express';
import { createTag, deleteTag, getAllTags, getTagById, updateTag } from '../controllers/tag.controller';
// import { validate } from '../validators/validate.middleware';
// import { createTagSchema, updateTagSchema, tagIdSchema } from '../validators/tag.validator';

const router = Router();

// Routes
router.get('/', getAllTags);
router.get('/:id', getTagById);
router.post('/', createTag); // add validate(createTagSchema) if middleware available
router.put('/:id', updateTag); // add validate(updateTagSchema) if middleware available
router.delete('/:id', deleteTag);

export default router;
