import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import models from '../../../src/app/models';
import { clearMockDB } from '../../config/mock_db_config';

chai.use(chaiHttp);

const { Fact, FactCategory } = models;

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

    await Fact.bulkCreate([
      {
        content: 'This is the best type of food you can get',
        type: 'fact',
        categoryId: 1,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        content: 'This is the best type of food you can get',
        type: 'tip',
        categoryId: 2,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        content: 'This is tnothingof food you can getd we',
        type: 'fact',
        categoryId: 2,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        content: 'This irjeiiw  you can get',
        type: 'fact',
        categoryId: 1,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        content: 'hellos the best type of food you can get',
        type: 'fact',
        categoryId: 1,
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      }
    ]);
  });

  describe('GET', () => {
    it('Should return all facts', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/facts/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('results')
        .with.lengthOf(5);
      expect(response.body.results[0]).to.have.property('category');
    });
    it('Should return all facts in a particular category', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/facts?categoryId=2')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('results')
        .with.lengthOf(2);
    });
  });
});
