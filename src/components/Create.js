import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CREATE } from '../constants/actions';
import selectUploadImage from '../selectors/uploadImage';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '',
      tags: [],
      people: []
    };
  }

  render(){
    const { image } = this.props;
    return (<div>
      <h2>Add metadata</h2>
      <img src={image.Location} alt="" />
      <form onSubmit={this.handleSubmit}>
        <p>
          <label>Title</label>
          <input type="text"name="title"  onChange={this.handleTextChange} placeholder="Title of this photo" />
        </p>
        <p>
          <label>Tags</label>
          <input type="text" name="tags"  onChange={this.handleArrayChange} placeholder="Enter tags" />
        </p>
        <p>
          <label>People</label>
          <input type="text" name="people" onChange={this.handleArrayChange} placeholder="People in this photo" />
        </p>
        <input type="submit" value="Add photo" />
      </form>
    </div>);
  }
  handleTextChange = (e) => {
    this.setState({[e.target.name]: e.target.value});
  }
  handleArrayChange = (e) => {
    const arr = e.target.value.split(',');
    this.setState({[e.target.name]: arr});
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onCreate({
      title: this.state.title,
      tags: this.state.tags,
      people: this.state.people
    })
  }
}

const mapStateToProps = state => {
  return {
    image: selectUploadImage(state)
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
