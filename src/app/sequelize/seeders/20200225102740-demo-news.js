module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'News',
      [
        {
          title: 'maintian a good health',
          host: 'health.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl: 'http://imageUrl.com',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          title: 'maintian a good health',
          host: 'health.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl: 'http://imageUrl.com',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-03 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          title: 'maintian a good health',
          host: 'last.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl: 'http://imageUrl.com',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-04 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('News', null, {});
  }
};
