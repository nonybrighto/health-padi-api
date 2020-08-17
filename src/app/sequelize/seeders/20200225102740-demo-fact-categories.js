module.exports = {
  up: (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert(
      'FactCategories',
      [
        {
          id: 1,
          name: 'Health',
          factCount: 10,
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          id: 2,
          name: 'Food',
          factCount: 20,
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          id: 3,
          name: 'Sports',
          factCount: 20,
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        },
        {
          id: 4,
          name: 'Excercise',
          factCount: 20,
          createdAt: '2019-01-01 02:00:00',
          updatedAt: '2019-01-01 02:00:00'
        }
      ],
      {}
    );
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('FactCategories', null, {});
  }
};
