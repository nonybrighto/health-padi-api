const UserStatusEnum = {
  regular: 'regular',
  super: 'super',
  editor: 'editor'
};

Object.freeze(UserStatusEnum);

function isAdmin(userStatus) {
  return userStatus === 'super' || userStatus === 'editor';
}

export { UserStatusEnum, isAdmin };
