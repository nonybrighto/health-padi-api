import chai from 'chai';
import chaiHttp from 'chai-http';
import faker from 'faker';
import models from '../../src/app/models';
import { UserStatusEnum } from '../../src/app/helpers/admin-helpers';
import emailHelper from '../../src/app/helpers/email-helper';

const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { User } = models;
chai.use(chaiHttp);

chai.use(sinonChai);

let sandbox = null;

async function clearMockDB() {
  await models.sequelize.sync({ force: true });
}

async function createAdminAndRegularUser(app) {
  try {
    sandbox = sinon.createSandbox();
    sandbox.stub(emailHelper, 'sendEmail').resolves(null);
    const validUser = {
      username: 'current',
      email: 'currentUserO@gmail.com',
      password: 'password@1'
    };
    const response = await chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(validUser);

    const adminUserResponse = await chai
      .request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'admin',
        email: 'adminuser@gmail.com',
        password: 'password@1'
      });

    const currentUserTokenString = `bearer ${response.body.token}`;
    const currentUser = response.body.user;

    const adminUserTokenString = `bearer ${adminUserResponse.body.token}`;
    const adminUser = adminUserResponse.body.user;

    await User.update(
      {
        status: UserStatusEnum.super
      },
      {
        where: {
          id: adminUser.id
        }
      }
    );

    sandbox.restore();
    return {
      currentUserTokenString,
      currentUser,
      adminUserTokenString,
      adminUser
    };
  } catch (err) {
    sandbox.restore();
    return false;
  }
}

async function createRegularUser(app, isMentor = false) {
  try {
    sandbox = sinon.createSandbox();
    sandbox.stub(emailHelper, 'sendEmail').resolves(null);
    const rand = faker.random.number();
    const validUser = {
      username: faker.name.firstName(),
      email: `${rand}currentUserO@gmail.com`,
      password: 'password@1',
      isMentor
    };
    const response = await chai
      .request(app)
      .post('/api/v1/auth/register')
      .send(validUser);

    const currentUserTokenString = `bearer ${response.body.token}`;
    const currentUser = response.body.user;

    sandbox.restore();
    return {
      currentUserTokenString,
      currentUser
    };
  } catch (err) {
    sandbox.restore();
    return false;
  }
}

export { clearMockDB, createRegularUser, createAdminAndRegularUser };
