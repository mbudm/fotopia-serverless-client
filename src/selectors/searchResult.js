import searchResults from './searchResults';

const selectSearchResult = (state = {}, fotoid) => {
  const result = searchResults(state).find(result => result.id === fotoid);
  return result || {};
};
export default selectSearchResult;
