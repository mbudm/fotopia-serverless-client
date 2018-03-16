import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UPLOAD } from '../constants/actions';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      image: ''
    };
  }

  render(){
    return (<div>
      <h2>Upload</h2>
      <form onSubmit={this.handleSubmit} >
        <input type="file" onChange={this.handleImageChange}/>
        <input type="submit" value="Upload" />
      </form>
    </div>);
  }

  handleImageChange = (e) => {
    this.setState({image: e.target.files[0]});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onUpload(
      this.state.image
    )
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onUpload(payload) {
      dispatch({
        type: UPLOAD,
        payload
      });
    }
  }
}

export default connect(
  null,
  mapDispatchToProps
)(Upload);
