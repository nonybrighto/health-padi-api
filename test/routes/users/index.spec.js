import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import models from '../../../src/app/models';
import { clearMockDB } from '../../config/mock_db_config';

chai.use(chaiHttp);

const { User } = models;
const { expect } = chai;

describe('users/', () => {
  before(async () => {
    await clearMockDB();
  });

  describe('GET', () => {
    it('Should return 200 on success with no user', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('results')
        .with.lengthOf(0);
    });

    it('Should return 200 on success with 1 user', async () => {
      const userProperties = {
        username: 'Peter',
        email: 'peter@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);

      const response = await chai
        .request(app)
        .get('/api/v1/users/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('results')
        .with.lengthOf(1);
      expect(response.body.results[0].username).to.be.equals(
        userProperties.username
      );
    });
  });
});
