const Joi = require('joi');

const sendChat = {
  body: {
    id: Joi.string().required(),
    deviceIdentifier: Joi.string().required(),
    content: Joi.string()
      .trim()
      .required()
      .max(200)
      .error(_ => {
        return {
          message: 'chat should be 1 to 200 characters'
        };
      })
  }
};

export default { sendChat };
