import React from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../constants/actions';

const Search = (props) => (
  <div>
    <h2>Search</h2>
    <button onClick={props.onGetLatest}>Get latest photos</button>
    <ul>
    </ul>
  </div>
);



const mapDispatchToProps = dispatch => {
  return {
    onGetLatest(e) {
      e.preventDefault();
      dispatch({
        type: SEARCH
      });
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Search)
