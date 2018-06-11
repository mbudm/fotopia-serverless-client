import React from 'react';
import { connect } from 'react-redux';

import selectResult from '../selectors/searchResult';

const Detail = props => {
  return (
    <div>
      <h2>Detail</h2>
      <img src={props.result.img_location} alt=""/>
    </div>
  );
};

const mapStateToProps = (state, ownProps) => {
  return {
    result: selectResult(state, ownProps.fotoid)
  }
}
export default connect(
  mapStateToProps,
  null
)(Detail);
