import {
  NEW_PASSWORD_REQUIRED,
  SIGNED_IN,
  SIGNED_OUT
} from '../constants/user';

const signedInStatus = (state = {}) => {
  if(state.user.username){
    if(state.user.challengeName === 'NEW_PASSWORD_REQUIRED'){
      return NEW_PASSWORD_REQUIRED;
    }else{
      return SIGNED_IN;
    }
  }else{
    return SIGNED_OUT;
  }
};
export default signedInStatus;
