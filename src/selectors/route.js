
import {
  HOME
} from '../constants/routes';

const selectRoute = (state = {}) => {
  return state.router ? state.router : { id: HOME } ;
};
export default selectRoute;
