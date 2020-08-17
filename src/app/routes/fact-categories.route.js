import express from 'express';
import factsController from '../controllers/facts.controller';

const router = express.Router();
router.route('/').get(factsController.getAllFactCategories);

export default router;
