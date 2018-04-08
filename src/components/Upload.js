import React, { Component } from 'react';
import { connect } from 'react-redux';
import { UPLOAD } from '../constants/actions';

class Upload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      nonImages: []
    };
  }

  render(){
    const {
      images,
      nonImages
    } = this.state;
    return (<div>
      <h2>Upload</h2>
      <form onSubmit={this.handleSubmit} >
        <input type="file" onChange={this.handleImagesChange} multiple/>
        {nonImages.length > 0 &&
          <p>You uploaded {nonImages.length} file(s) that are not images</p>
        }
        <div className="row" >
          {images.map(image => (
            <div className="col-md-2 center-block" key={image.file.name}>
              <img
                src={image.src}
                alt=" "
                data-filename={image.file.name}
                className="img-thumbnail img-responsive"
                onLoad={this.handleImageLoad}/>
              <table>
                <tbody>
                  <tr>
                    <th>Birthtime</th>
                    <td>{image.file.lastModifiedDate.toString()}</td>
                  </tr>
                  <tr>
                    <th>File size</th>
                    <td>{image.file.size}</td>
                  </tr>
                  <tr>
                    <th>Name</th>
                    <td>{image.file.name}</td>
                  </tr>
                  <tr>
                    <th>Type</th>
                    <td>{image.file.type}</td>
                  </tr>
                  <tr>
                    <th>Width</th>
                    <td>{image.width}</td>
                  </tr>
                  <tr>
                    <th>Height</th>
                    <td>{image.height}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <input type="submit" value="Upload" />
      </form>
    </div>);
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

  handleSubmit = (e) => {
    e.preventDefault();
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
