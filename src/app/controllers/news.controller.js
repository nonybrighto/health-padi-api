// import httpStatus from 'http-status';
// import createError from 'http-errors';
import DiscoveryV1 from 'ibm-watson/discovery/v1';
import httpStatus from 'http-status';
import models from '../models';
import listResponse from '../helpers/list-response';
import internalError from '../helpers/internal-error';
import config from '../../config/config';

const { News, Settings } = models;
const { IamAuthenticator } = require('ibm-watson/auth');
// const { Op } = models.Sequelize;

async function getAllNews(req, res, next) {
  try {
    return listResponse({
      getItemsWithCount: async (offset, limit) =>
        News.findAndCountAll({
          offset,
          limit,
          order: [['createdAt', 'DESC']]
        }),
      errorMessage: 'getting news'
    })(req, res, next);
  } catch (error) {
    return next(internalError('getting news', error));
  }
}
async function getNewsUpdates(req, res, next) {
  try {
    const newsUpdateSetting = await Settings.findOne({
      where: { key: 'last-news-update' }
    });
    const newsUpdateDateUTCString = newsUpdateSetting
      ? new Date(newsUpdateSetting.value).toISOString()
      : new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(); // one day ago

    const discoveryClient = new DiscoveryV1({
      authenticator: new IamAuthenticator({
        apikey: config.get('watson-discovery-api-key')
      }),
      version: config.get('watson-discovery-version'),
      url: config.get('watson-discovery-url')
    });

    const queryParams = {
      environmentId: 'system',
      collectionId: 'news-en',
      filter: `country:NG,enriched_text.categories.label:health,crawl_date>${newsUpdateDateUTCString}`
    };

    const response = await discoveryClient.query(queryParams);

    await Promise.all(
      response.result.results.map(async news => {
        await News.create({
          title: news.title,
          host: news.host,
          sourceUrl: news.url,
          imageUrl: news.main_image_url,
          summary: news.text,
          publishedAt: news.publication_date,
          crawledAt: news.crawl_date
        });
      })
    );

    await Settings.upsert({
      key: 'last-news-update',
      value: new Date().toISOString()
    });
    // return res.sendStatus(httpStatus.OK);
    return res.status(httpStatus.OK).send(response);
  } catch (error) {
    return next(internalError('update news', error));
  }
}

export default {
  getAllNews,
  getNewsUpdates
};
