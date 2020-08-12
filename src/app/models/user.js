/* eslint-disable func-names */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { validEmail } from '../helpers/validators';
// import emailHelper from '../helpers/email-helper';
import config from '../../config/config';
/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - name
 *          - email
 *        properties:
 *          name:
 *            type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           name: Alexander
 *           email: fake@email.com
 */
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      avatarUrl: {
        type: DataTypes.STRING,
        get() {
          const avatarUrl = this.getDataValue('avatarUrl');
          if (avatarUrl) {
            if (avatarUrl.startsWith('http')) {
              return avatarUrl;
            }
            return avatarUrl; // TODO: change to return url from system
          }
          return null;
        }
      },
      password: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING,
        defaultValue: 'regular'
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      isBlocked: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      defaultScope: {
        where: {
          isBlocked: false
        },
        attributes: { exclude: ['password', 'email'] }
      },
      scopes: {
        withHidden: {
          attributes: {}
        },
        withEmail: {
          attributes: {
            include: ['email']
          }
        },
        userBasic() {
          return {
            attributes: ['id', 'username', 'isBlocked']
          };
        }
      }
    }
  );

  User.beforeCreate(async (user, _options) => {
    const passwordHash = await bcrypt.hash(user.password, 10);
    user.password = passwordHash;
  });

  User.prototype.changePassword = async function(newPassword) {
    this.password = await bcrypt.hash(newPassword, 10);
    const user = await this.save();
    if (user) {
      return true;
    }
    return false;
  };

  User.prototype.toJSON = function() {
    const values = { ...this.get() };
    delete values.password;
    return values;
  };

  User.prototype.generateJwtToken = function() {
    const expireDays = config.get('jwt-token-expire-days');

    return jwt.sign(
      { id: this.id, username: this.username, email: this.email },
      config.get('jwt-secret'),
      { expiresIn: `${expireDays} days` }
    );
  };

  User.prototype.toAuthJSON = function() {
    const expireDays = config.get('jwt-token-expire-days');
    const expirationDate = new Date();
    expirationDate.setDate(new Date().getDate() + expireDays);

    return {
      token: this.generateJwtToken(),
      tokenExpires: expirationDate,
      user: this.get()
    };
  };

  User.getUser = async function({ userId, currentUserId }) {
    const user = await User.getUsers({
      userId,
      currentUserId
    });
    return user.length > 0 ? user[0] : null;
  };

  User.canLogin = async function(credential, password) {
    const userDataToFind = {};
    const credentialLower = credential.toLowerCase();
    if (validEmail(credential)) {
      userDataToFind.email = credentialLower;
    } else {
      userDataToFind.username = credentialLower;
    }

    const user = await this.scope('withHidden').findOne({
      where: userDataToFind
    });
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) {
        return user;
      }
      return false;
    }
    return false;
  };

  User.createUser = async function({ username, email, password, avatarUrl }) {
    const tr = await sequelize.transaction();
    const registeredUser = await User.create(
      {
        username,
        email,
        password,
        avatarUrl
      },
      { transaction: tr }
    );
    await tr.commit();

    // emailHelper.sendEmail({
    //   to: registeredUser.email,
    //   from: emailHelper.userContactEmail(),
    //   subject: 'Welcome to Health Padi',
    //   text: `Dear ${registeredUser.username}, You have successfully joined health padi `
    // });
    return registeredUser;
  };

  User.findOrCreateSocialUser = async function({ name, email, avatarUrl }) {
    const user = await this.findOne({ where: { email } });
    if (user) {
      return user;
    }
    const compactName = name.replace(/\s/g, '');
    const username = await _createUniqueUsername(compactName);
    const randomPasswordString = Math.random()
      .toString(36)
      .slice(-8);
    const userRegistered = await User.createUser({
      username,
      email,
      password: randomPasswordString,
      avatarUrl
    });

    return userRegistered;
  };

  async function _createUniqueUsername(firstName = '') {
    let username =
      firstName.length < 25
        ? firstName.toLowerCase()
        : firstName.substring(0, 24).toLowerCase();
    // eslint-disable-next-line no-await-in-loop
    while (await User.findOne({ where: { username } })) {
      const randomNumbers = Math.floor(Math.random() * 90);
      username += randomNumbers;
    }
    return username;
  }
  return User;
};
