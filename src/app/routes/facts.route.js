import express from 'express';
import paginationMiddleware from '../middlewares/pagination.middleware';
import factsController from '../controllers/facts.controller';

const router = express.Router();
router.route('/').get([paginationMiddleware], factsController.getAllFacts);

export default router;
