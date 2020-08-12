import chai from 'chai';
import chaiHttp from 'chai-http';
import httpStatus from 'http-status';
import app from '../../../src/app';
import models from '../../../src/app/models';
// import notificationHelper from '../../../src/app/helpers/notification-helper';
// import emailHelper from '../../../src/app/helpers/email-helper';
import { clearMockDB } from '../../config/mock_db_config';

chai.use(chaiHttp);

const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { User } = models;

const { expect } = chai;

chai.use(sinonChai);

let sandbox = null;
// let sb;
// let emailSb;

describe('auth/', () => {
  before(async () => {
    await clearMockDB();
  });

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    // sb = sandbox.stub(notificationHelper, 'createNotification').resolves(null);
    // emailSb = sandbox.stub(emailHelper, 'sendEmail').resolves(null);
  });

  afterEach(() => {
    // notificationHelper.createNotification.restore();
    sandbox.restore();
  });

  describe('register', () => {
    it('Should fail if no username, email or password', async () => {
      const response = await Promise.all([
        chai
          .request(app)
          .post('/api/v1/auth/register')
          .send({
            username: 'amaka',
            password: 'testing1921**'
          }),
        chai
          .request(app)
          .post('/api/v1/auth/register')
          .send({
            email: 'mary@gaga.com',
            password: 'testing1921**'
          }),
        chai
          .request(app)
          .post('/api/v1/auth/register')
          .send({
            username: 'themainman',
            email: 'mary@gaga.com'
          })
      ]);

      expect(response[0]).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response[1]).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response[2]).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('Should fail if password less than 4 characters', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'jane',
          email: 'janemary@mail.com',
          password: 'tes'
        });

      expect(response).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
    });

    it('should fail if email exists ', async () => {
      const userProperties = {
        username: 'peterpan',
        email: 'peterpan@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'availablename',
          email: 'peterpan@gmail.com',
          password: 'teslamoonmicrowave29#'
        });

      expect(response).to.have.status(httpStatus.CONFLICT);
    });
    it('should fail if username exists ', async () => {
      const userProperties = {
        username: 'jane',
        email: 'gala@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'jane',
          email: 'availableemail@gmail.com',
          password: 'teslamoonmicrowave29#'
        });

      expect(response).to.have.status(httpStatus.CONFLICT);
    });

    it('should register user successfully', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'chika',
          email: 'chika@gmail.com',
          password: 'teskid43^$'
        });
      expect(response).to.have.status(httpStatus.CREATED);
      expect(response.body).to.have.property('user');
      expect(response.body.user.username).to.equal('chika');
    });
  });

  describe('login', () => {
    it('Should fail if login details are not valid', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({ credential: 'wronguser', password: 'MyPassword' });

      expect(response).to.have.status(httpStatus.BAD_REQUEST);
    });

    it('Should succeed if login details are valid - username', async () => {
      const userProperties = {
        username: 'petzzz',
        email: 'petzz@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          credential: userProperties.username,
          password: userProperties.password
        });

      expect(response).to.have.status(httpStatus.OK);
    });
    it('Should succeed if login details are valid uppercase/mixed case - username', async () => {
      const userProperties = {
        username: 'petzzzgg',
        email: 'petzzzgg@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          credential: 'Petzzzgg',
          password: userProperties.password
        });

      expect(response).to.have.status(httpStatus.OK);
    });
    it('Should succeed if login details are valid - email', async () => {
      const userProperties = {
        username: 'petzzzaag',
        email: 'petzzzaag@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          credential: userProperties.email,
          password: userProperties.password
        });

      expect(response).to.have.status(httpStatus.OK);
    });
    it('Should succeed if login details are valid uppercase/mixed case - email', async () => {
      const userProperties = {
        username: 'petzzzaa',
        email: 'petzzzaa@gmail.com',
        password: 'password@1'
      };
      await User.create(userProperties);
      const response = await chai
        .request(app)
        .post('/api/v1/auth/login')
        .send({
          credential: 'PETzzzaa@gmail.com',
          password: userProperties.password
        });

      expect(response).to.have.status(httpStatus.OK);
    });
  });
});
