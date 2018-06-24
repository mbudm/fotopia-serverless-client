export default function getIndex(state, key){
  return state.search && state.search.indexes  && state.search.indexes[key] ?
    Object.keys(state.search.indexes[key]).map((k, id) => ({name: k, id,})) :
    [];
}

