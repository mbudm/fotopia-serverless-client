const selectUsername = (state = {}) => {
  return state.user && state.user.username;
};
export default selectUsername;
