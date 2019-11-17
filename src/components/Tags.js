import React, { Component }  from 'react';
import ReactTags from 'react-tag-autocomplete';
import { ControlLabel } from "react-bootstrap";
import uuid from 'uuid';

import './tags.css';

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
      <div>
        <ControlLabel>{title}</ControlLabel>
        <ReactTags
          placeholder={placeholder}
          tags={this.state.tagObjects}
          suggestions={suggestedTags}
          handleDelete={this.handleDeleteTag}
          handleAddition={this.handleAddTag}
          allowNew={false} />
      </div>
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
    const matchingSuggestion = suggested.find(item => item.id === tag);
    return {
      id: matchingSuggestion ? matchingSuggestion.id : getId(),
      name: matchingSuggestion.name,
    }
  });
}

const tagsToString = (tagObjects) => tagObjects.map(tagObj => tagObj.name);

export default Tags;
