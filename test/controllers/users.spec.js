/* eslint-disable no-unused-expressions */
import httpStatus from 'http-status';
import usersController from '../../src/app/controllers/users.controller';
import models from '../../src/app/models';

const chai = require('chai');
const faker = require('faker');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { expect } = chai;

const { User } = models;

chai.use(sinonChai);

let sandbox = null;

describe('Users controller', () => {
  const req = {
    user: {
      id: faker.random.number()
    },
    params: {
      userParam: 1
    }
  };
  const res = {
    send() {
      return this;
    },
    status() {
      return this;
    }
  };

  let next = null;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
    next = sandbox.stub();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('should display return 200OK for single user details fetch', async () => {
    sandbox.spy(res, 'status');
    sandbox.stub(User, 'scope').returns({
      findOne: sandbox.stub().resolves({
        id: faker.random.number(),
        username: faker.name.findName(),
        email: 'hello@gmail.com'
      })
    });
    await usersController.getUser(req, res, next);
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
  });

  // it('should fail if user not found', async () => {
  //   sandbox.spy(res, 'status');
  //   // sinon.spy(next);
  //   sandbox.stub(User, 'scope').returns({
  //     findOne: sandbox.stub().resolves(null)
  //   });
  //   await usersController.getUser(req, res, next);
  //   expect(next).to.have.been.called;
  // });

  it('Should get all users', async () => {
    const reqi = {
      user: {
        id: faker.random.number()
      },
      params: {
        userParam: 1
      },
      query: {
        page: 1,
        limit: 10
      }
    };
    sandbox.spy(res, 'status');
    sandbox.stub(User, 'scope').returns({
      count: sandbox.stub().resolves(10),
      findAll: sandbox.stub().resolves([])
    });
    await usersController.getAllUsers(reqi, res, next);
    expect(res.status).to.have.been.calledWith(httpStatus.OK);
  });

  it('Allow only admin when fetchtype is set', async () => {
    const reqi = {
      user: {
        id: faker.random.number(),
        userStatus: 0
      },
      params: {
        userParam: 1
      },
      query: {
        page: 1,
        limit: 10,
        fetchType: 'active'
      }
    };
    sandbox.spy(res, 'status');
    sandbox.stub(User, 'scope').returns({
      count: sandbox.stub().resolves(10),
      findAll: sandbox.stub().resolves([])
    });
    await usersController.getAllUsers(reqi, res, next);
    expect(next).to.have.been.called;
  });
});
