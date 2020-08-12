import express from 'express';
import usersController from '../controllers/users.controller';
import paginationMiddleware from '../middlewares/pagination.middleware';
import { jwtOptionalAuthentication } from '../middlewares/auth.middleware';

const router = express.Router();
/**
 * @swagger
 * path:
 *  /users:
 *    get:
 *      summary: Get a list of all the users in the system
 *      tags: [Users]
 *      responses:
 *        "200":
 *          description: A user object
 *          content:
 *            application/json:
 *              schema:
 *                $ref: '#/components/schemas/User'
 */
router
  .route('/')
  .get(
    [paginationMiddleware, jwtOptionalAuthentication],
    usersController.getAllUsers
  );
router
  .route('/:userParam')
  .get([jwtOptionalAuthentication], usersController.getUser);
export default router;
