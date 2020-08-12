import express from 'express';
import paginationMiddleware from '../middlewares/pagination.middleware';
import newsController from '../controllers/news.controller';

const router = express.Router();
router.route('/').get([paginationMiddleware], newsController.getAllNews);
router.route('/updates').get(newsController.getNewsUpdates);

export default router;
