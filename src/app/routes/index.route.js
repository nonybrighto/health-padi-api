import express from 'express';
import usersRoutes from './users.route';
import userRoutes from './user.route';
import authRoutes from './auth.route';
import newsRoutes from './news.route';

const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const router = express.Router();

const options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Health Padi',
      version: '1.0.0',
      description: 'A medical/health application for nigerians',
      license: {
        name: 'MIT',
        url: 'https://choosealicense.com/licenses/mit/'
      },
      contact: {
        name: 'nonybrighto',
        url: 'http://www.nonybrighto.com',
        email: 'nonybrighto@gmail.com'
      }
    },
    servers: [
      {
        url: '/api/v1'
      }
    ]
  },
  apis: ['./src/app/models/user.js', './src/app/routes/*.route.js']
};

router.use('/users', usersRoutes);
router.use('/user', userRoutes);
router.use('/auth', authRoutes);
router.use('/news', newsRoutes);
const specs = swaggerJsdoc(options);
router.use('/docs', swaggerUi.serve);
router.get(
  '/docs',
  swaggerUi.setup(specs, {
    explorer: true
  })
);

export default router;
