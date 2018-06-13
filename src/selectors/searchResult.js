import searchResults from './searchResults';

const selectSearchResult = (state = {}, fotoid) => {
  return searchResults(state).find(result => result.id === fotoid);
};
export default selectSearchResult;
