
export default function selectPeople(state){
  return state.people && Array.isArray(state.people.results) ?
    state.people.results :
    [];
}
