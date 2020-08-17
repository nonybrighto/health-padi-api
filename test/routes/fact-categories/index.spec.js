import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import models from '../../../src/app/models';
import { clearMockDB } from '../../config/mock_db_config';

chai.use(chaiHttp);

const { FactCategory } = models;

const { expect } = chai;

describe('facts/', () => {
  before(async () => {
    await clearMockDB();

    await FactCategory.bulkCreate([
      {
        name: 'Food',
        factCount: 20,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        name: 'Sports',
        factCount: 20,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        name: 'Excercise',
        factCount: 20,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      }
    ]);
  });

  describe('GET', () => {
    it('Should return all categories', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/fact-categories/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.be.an('array')
        .with.lengthOf(3);
    });
  });
});
