import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button, FormGroup, FormControl, Alert } from "react-bootstrap";
import { UPLOAD } from '../constants/actions';

import './upload.css';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      nonImages: []
    };
  }
  render(){
    return this.state.uploading ? this.renderLoader() : this.renderForm();
  }

  renderLoader = () => (<img src="loader.svg" alt="uploading"/>);

  validateForm = () => {
    return this.state.images.length > 0;
  }

  renderForm(){
    const {
      images,
      nonImages
    } = this.state;
    const submitOpts = {};
    if(images.length === 0){
      submitOpts.disabled = "disabled"
    };
    return (<Grid>
      <h2>Upload</h2>
      <form onSubmit={this.handleSubmit} className="upload-form">
        <FormGroup bsSize="large">
          <FormControl
            autoFocus
            type="file"
            value={this.state.username}
            onChange={this.handleImagesChange}
            multiple
          />
          {nonImages.length > 0 &&
            <Alert bsStyle="warning">You selected {nonImages.length} file(s) that are not images</Alert>
          }
        </FormGroup>
        <Row>
          {images.map(image => (
            <Col xs={12} key={image.file.name}>
              <img
                src={image.src}
                alt=" "
                data-filename={image.file.name}
                className="img-thumbnail img-responsive"
                onLoad={this.handleImageLoad}/>
            </Col>
          ))}
        </Row>
        <FormGroup >
          <Button
              block
              bsSize="large"
              disabled={!this.validateForm()}
              type="submit"
            >
            Upload
          </Button>
        </FormGroup>
      </form>
    </Grid>);
  }

  handleImageLoad = (e) => {
    const img = e.target;
    const filename = img.dataset.filename;
    const newImagesState = this.state.images.map((imgObject) => {
      return {
        ...imgObject,
        width: imgObject.file.name === filename ? img.naturalWidth : imgObject.width,
        height: imgObject.file.name === filename ? img.naturalHeight : imgObject.height,
      }
    });
    this.setState({
      images: newImagesState
    });

  }

  handleImagesChange = (e) => {
    const selectedFiles = [...e.target.files];
    const imageFiles = [];
    const nonImageFiles = []
    selectedFiles.forEach(file => {
      if(file.type.startsWith('image')){
        imageFiles.push(file);
      }else{
        nonImageFiles.push(file);
      }
    });

    Promise.all(imageFiles.map((file) => new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        res({
          src: e.target.result,
          file
        });
      };
      reader.readAsDataURL(file);
    })))
      .then((files) => {
        this.setState({
          images: files,
          nonImages: nonImageFiles,
        });
      });
  }

  handleTagUpdate = (id, key, tags) => {
    const images = this.state.images.map((img) => {
      return img.file.name === id ?
        { ...img, [key]: tags} :
        { ...img};
    });
    this.setState({
      images,
    });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      uploading: true
    });
    this.props.onUpload(
      this.state.images
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
