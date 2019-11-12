import {
  MAX_SEARCH_DURATION_MS
} from '../constants/search';

export default function selectFilters(state){
  const now = Date.now()
  return state.search && state.search.filters ?
    state.search.filters :
    {
      criteria: {
        tags: [],
        people: []
      },
      to: now,
      from: now - MAX_SEARCH_DURATION_MS
    };
}
