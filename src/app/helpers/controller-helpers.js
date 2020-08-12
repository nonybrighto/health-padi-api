import models from '../models';

const { User } = models;

async function getUser(userParam) {
  const user = await User.findOne({
    where: Number.isNaN(Number(userParam))
      ? { username: userParam }
      : { id: userParam }
  });
  if (!user) {
    return false;
  }
  return user;
}

// eslint-disable-next-line import/prefer-default-export
export { getUser };
