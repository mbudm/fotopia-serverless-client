import React from 'react';
import { connect } from 'react-redux';

const Edit = props => {
  return (
    <div>
      <h2>Edit</h2>
      <p>{props.config.received}</p>
    </div>
  );
};

export default connect(state => {
  return {
    config: state.config
  };
})(Edit);
