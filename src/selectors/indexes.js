export default function getIndex(state, key){
  return state.search && state.search.indexes  && state.search.indexes[key] ?
    Object.keys(state.search.indexes[key]).map((k, id) => ({name: k, id,})) :
    [];
}

export function selectIndexCounts(state, key){
  return state.search && state.search.indexes  && state.search.indexes[key] ?
    Object.keys(state.search.indexes[key]).map((k) =>
      ({name: k, count:state.search.indexes[key][k],}))
      .filter(item => item.count > 0) :
    [];
}

