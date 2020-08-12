import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../../../src/app';
import models from '../../../src/app/models';
import { clearMockDB } from '../../config/mock_db_config';

chai.use(chaiHttp);

const { News } = models;

const { expect } = chai;

describe('news/', () => {
  before(async () => {
    await clearMockDB();

    await News.bulkCreate([
      {
        title: 'maintian a good health',
        host: 'health.ng',
        sourceUrl: 'http://www.google.com',
        imageUrl: 'http://imageUrl.com',
        summary: 'this is the summary of the news',
        publishedAt: '2019-01-01 02:00:00',
        crawledAt: '2019-01-01 02:00:00',
        createdAt: '2019-01-01 02:00:00'
      },
      {
        title: 'maintian a good health',
        host: 'health.ng',
        sourceUrl: 'http://www.google.com',
        imageUrl: 'http://imageUrl.com',
        summary: 'this is the summary of the news',
        publishedAt: '2019-01-01 02:00:00',
        crawledAt: '2019-01-01 02:00:00',
        createdAt: '2019-01-03 02:00:00'
      },
      {
        title: 'maintian a good health',
        host: 'last.ng',
        sourceUrl: 'http://www.google.com',
        imageUrl: 'http://imageUrl.com',
        summary: 'this is the summary of the news',
        publishedAt: '2019-01-01 02:00:00',
        crawledAt: '2019-01-01 02:00:00',
        createdAt: '2019-01-04 02:00:00'
      }
    ]);
  });

  describe('GET', () => {
    it('Should return all news', async () => {
      const response = await chai
        .request(app)
        .get('/api/v1/news/')
        .set('Content-Type', 'application/json');
      expect(response).to.have.status(200);
      expect(response.body)
        .to.have.property('results')
        .with.lengthOf(3);

      expect(response.body.results[0].host).to.equals('last.ng');
    });
  });
});
