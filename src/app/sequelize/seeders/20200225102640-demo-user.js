const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    const users = [
      {
        username: 'nony',
        email: 'nony@gmail.com',
        password: 'thepassword69',
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      },
      {
        username: 'amaka',
        email: 'amaka@gmail.com',
        password: 'thepassword69',
        createdAt: '2019-01-01 02:00:00',
        updatedAt: '2019-01-01 02:00:00'
      }
    ].map(async user => {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const pwd = { password: passwordHash };
      return { ...user, ...pwd };
    });

    const allUsers = await Promise.all(users);
    return queryInterface.bulkInsert('Users', await allUsers, {});
  },

  down: (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
