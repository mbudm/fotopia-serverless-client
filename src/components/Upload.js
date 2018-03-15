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
    const { image } = this.props;
    return image ? this.renderCreateForm() : this.renderUploadForm();
  }

  renderUploadForm(){
    return (<div>
      <h2>Upload</h2>
      <form onSubmit={this.handleSubmit} >
        <input type="file" onChange={this.handleImageChange}/>
        <input type="submit" value="Upload" />
      </form>
    </div>);
  }
  renderCreateForm(){
    const { image } = this.props;
    return (<div>
      <h2>Add metadata</h2>
      <img src={image.Location} alt="" />
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

const mapStateToProps = state => {
  return {
    image: state.upload.image
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
  mapStateToProps,
  mapDispatchToProps
)(Upload);
