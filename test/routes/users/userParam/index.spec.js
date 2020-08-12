import chai from 'chai';
import chaiHttp from 'chai-http';
import httpStatus from 'http-status';
import models from '../../../../src/app/models';
import app from '../../../../src/app';
import { clearMockDB, createRegularUser } from '../../../config/mock_db_config';

chai.use(chaiHttp);

const { User } = models;
const { expect } = chai;

describe('user/', () => {
  let currentUserTokenString;
  const userId = 4;
  before(async () => {
    await clearMockDB();

    ({ currentUserTokenString } = await createRegularUser(app, true));

    await User.bulkCreate([
      {
        id: userId,
        username: 'john',
        email: 'john@gmail.com'
      },
      {
        id: 10,
        username: 'mark',
        email: 'mark@gmail.com'
      }
    ]);
  });

  describe('GET', () => {
    it('should get the user with id', async () => {
      const response = await chai
        .request(app)
        .get(`/api/v1/users/${userId}`)
        .set('Authorization', currentUserTokenString);

      expect(response).to.have.status(httpStatus.OK);
      expect(response.body).to.have.property('username');
      expect(response.body.username).to.equals('john');
    });
    it('should return not found if no user', async () => {
      const response = await chai
        .request(app)
        .get(`/api/v1/users/99`)
        .set('Authorization', currentUserTokenString);

      expect(response).to.have.status(httpStatus.NOT_FOUND);
    });
  });
});
