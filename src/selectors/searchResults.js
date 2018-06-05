const selectSearchResults = (state = {}) => {
  return (state.search && state.search.results) || [] ;
};
export default selectSearchResults;
