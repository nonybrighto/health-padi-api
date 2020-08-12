import joi from 'joi';

const createUser = {
  body: {
    // @ts-ignore
    username: joi
      .string()
      .lowercase()
      .trim()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required()
      // @ts-ignore
      .error(_ => {
        return {
          message: 'username should be 4 to 30 characters'
        };
      }),
    email: joi
      .string()
      .lowercase()
      .trim()
      .email()
      .required()
      // @ts-ignore
      .error(_ => {
        return {
          message: 'Please use a valid email'
        };
      }),
    password: joi
      .string()
      .min(4)
      .required()
      // @ts-ignore
      .error(_ => {
        return {
          message: 'Your password should be 4 or more characters'
        };
      })
  }
};

const changePassword = {
  body: {
    oldPassword: joi.string().required(),
    newPassword: joi
      .string()
      .min(4)
      .required()
      // @ts-ignore
      .error(_ => {
        return {
          message: 'Your password should be 4 or more characters'
        };
      })
  }
};

const forgotPasswordRequest = {
  body: {
    email: joi
      .string()
      .trim()
      .email()
      .required()
  }
};

const updateEmail = {
  body: {
    email: joi
      .string()
      .trim()
      .email()
      .required()
  }
};

const changePasswordWithToken = {
  body: {
    token: joi
      .string()
      .min(7)
      .required(),
    newPassword: joi
      .string()
      .regex(
        /^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})/
      )
      .required()
  }
};

export default {
  createUser,
  changePassword,
  forgotPasswordRequest,
  changePasswordWithToken,
  updateEmail
};
