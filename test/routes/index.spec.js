import chai from 'chai';
import chaiHttp from 'chai-http';
import httpStatus from 'http-status';
import app from '../../src/app';
import { clearMockDB } from '../config/mock_db_config';

chai.use(chaiHttp);

const { expect } = chai;

describe('users/', () => {
  before(async () => {
    await clearMockDB();
  });

  describe('GET', () => {
    it('Should return 404 when url not valid', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/usersfakelink/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(httpStatus.NOT_FOUND);
    });
  });
});
