module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'News',
      [
        {
          title: 'this is the first',
          host: 'health.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl:
            'https://igbotrade.s3.us-east-2.amazonaws.com/post_images/1580305153466.jpg',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          title: 'this is the second',
          host: 'health.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl:
            'https://igbotrade.s3.us-east-2.amazonaws.com/post_images/1580305153466.jpg',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-03 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          title: 'another awesome nonsense content for you to see',
          host: 'last.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl:
            'https://igbotrade.s3.us-east-2.amazonaws.com/post_images/1580305153466.jpg',
          summary: 'this is the summary of the news',
          publishedAt: '2019-01-01 02:00:00',
          crawledAt: '2019-01-01 02:00:00',
          createdAt: '2019-01-04 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          title: 'maintian a good health and always show',
          host: 'last.ng',
          sourceUrl: 'http://www.google.com',
          imageUrl:
            'https://igbotrade.s3.us-east-2.amazonaws.com/post_images/1580305153466.jpg',
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
