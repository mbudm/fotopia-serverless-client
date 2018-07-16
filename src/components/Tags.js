import React, { Component }  from 'react';
import { connect } from 'react-redux';
import ReactTags from 'react-tag-autocomplete';
import { FormGroup, ControlLabel } from "react-bootstrap";
import uuid from 'uuid';

import './tags.css';
import getIndex from '../selectors/indexes';


class Tags extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tagObjects: formatTags(props.tags, props.suggestedTags)
    };
  }

  render(){
    const {
      title,
      placeholder,
      suggestedTags
    } = this.props;
    return (
      <FormGroup>
        <ControlLabel>{title}</ControlLabel>
        <ReactTags
          placeholder={placeholder}
          tags={this.state.tagObjects}
          suggestions={suggestedTags}
          handleDelete={this.handleDeleteTag}
          handleAddition={this.handleAddTag}
          allowNew />
      </FormGroup>
    );
  }
  handleDeleteTag = (i) => {
    const tagObjects = this.state.tagObjects.filter((tag, idx, arr) => tag.name !== arr[i].name);
    this.setState({tagObjects});
    this.props.onTagUpdate(this.props.id, this.props.tagKey, tagsToString(tagObjects));
  }
  handleAddTag = (tag) => {
    const tagObjects = [].concat(this.state.tagObjects, tag)
    this.setState({tagObjects});
    this.props.onTagUpdate(this.props.id, this.props.tagKey, tagsToString(tagObjects));
  }
}

const getId = () => uuid.v1();

const formatTags = (tags = [], suggested = []) => {
  return tags.map((tag) => {
    const matchingSuggestion = suggested.find(item => item.name === tag);
    return {
      id: matchingSuggestion ? matchingSuggestion.id : getId(),
      name: tag,
    }
  });
}

const tagsToString = (tagObjects) => tagObjects.map(tagObj => tagObj.name);

export default connect((state, ownProps) => {
  const suggestedTags = getIndex(state, ownProps.tagKey);
  return {
    suggestedTags,
  };
})(Tags);
