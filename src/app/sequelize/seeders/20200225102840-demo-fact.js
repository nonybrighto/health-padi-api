module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'Facts',
      [
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
          categoryId: 3,
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Facts', null, {});
  }
};
