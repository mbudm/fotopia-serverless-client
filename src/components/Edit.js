import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

const Edit = props => {
  return (
    <div>
      <h2>Edit</h2>
      <p>{this.props.config}</p>
    </div>
  );
};

export default withRouter(connect(state => {
  return {
    config: state.config
  };
}))(Edit);
