export default function selectFilters(state){
  return state.search && state.search.filters ?
    state.search.filters :
    {
      tags: [],
      people: []
    };
}
