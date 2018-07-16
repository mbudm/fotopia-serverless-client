export default function getIndex(state, key){
  return state.indexes  && state.indexes[key] ?
    Object.keys(state.indexes[key]).map((k, id) => ({name: k, id,})) :
    [];
}

export function selectIndexCounts(state, key){
  return state.indexes  && state.indexes[key] ?
    Object.keys(state.indexes[key]).map((k) =>
      ({name: k, count:state.indexes[key][k],}))
      .filter(item => item.count > 0) :
    [];
}

export function selectIndexError(state){
  return state.indexes && state.indexes.error ?
    state.indexes.error  :
    null;
}

export function selectIndexIsLoading(state){
  return state.indexes && state.indexes.isLoading ?
    true :
    false;
}
