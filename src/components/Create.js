import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CREATE } from '../constants/actions';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ''
    };
  }

  render(){
    const { image } = this.props;
    return (<div>
      <h2>Add metadata</h2>
      <img src={image.Location} alt="" />
    </div>);
  }
}

const mapStateToProps = state => {
  return {
    image: state.upload.image
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onCreate(payload) {
      dispatch({
        type: CREATE,
        payload
      });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Create);
