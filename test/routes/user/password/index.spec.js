import chai from 'chai';
import chaiHttp from 'chai-http';
import httpStatus from 'http-status';
import app from '../../../../src/app';
import { clearMockDB, createRegularUser } from '../../../config/mock_db_config';

chai.use(chaiHttp);

const { expect } = chai;

describe('user/password', () => {
  let currentUserTokenString;
  const oldPassword = 'password@1'; // gotten from createRegularUser() function
  before(async () => {
    await clearMockDB();

    ({ currentUserTokenString } = await createRegularUser(app));
  });

  describe('POST', () => {
    it('Should fail if user not authenticated', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/user/password')
        .send({
          oldPassword,
          newPassword: 'tralabyte1234@'
        });
      expect(response).to.have.status(httpStatus.UNAUTHORIZED);
    });

    it('should fail if password below validation requirement', async () => {
      const response = await Promise.all([
        chai
          .request(app)
          .post('/api/v1/user/password')
          .set('Authorization', currentUserTokenString)
          .send({
            oldPassword,
            newPassword: 'cat' // less than 4 characters
          }),
        chai
          .request(app)
          .post('/api/v1/user/password')
          .set('Authorization', currentUserTokenString)
          .send({
            oldPassword,
            newPassword: 'old' // less than 4 characters
          })
      ]);
      expect(response[0]).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
      expect(response[1]).to.have.status(httpStatus.UNPROCESSABLE_ENTITY);
    });
    it('should fail if old password is incorrect', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/user/password')
        .set('Authorization', currentUserTokenString)
        .send({
          oldPassword: 'fakepasswordOfhacker@1234',
          newPassword: 'newPassword@123459'
        });

      expect(response).to.have.status(httpStatus.FORBIDDEN);
    });
    it('should successfully change password', async () => {
      const response = await chai
        .request(app)
        .post('/api/v1/user/password')
        .set('Authorization', currentUserTokenString)
        .send({
          oldPassword,
          newPassword: 'newPassword@123459'
        });

      expect(response).to.have.status(httpStatus.NO_CONTENT);
    });
  });
});
