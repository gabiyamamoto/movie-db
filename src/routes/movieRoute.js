import express from 'express';
import * as movieController from '../controllers/movieController.js';

const router = express.Router();

router.get('/movie', movieController.getAll);
router.get('/movie/:id', movieController.getById);
router.delete('/movie/:id', movieController.remove);
router.post('/movie', movieController.create);
router.put('/movie/:id', movieController.update);

export default router;
