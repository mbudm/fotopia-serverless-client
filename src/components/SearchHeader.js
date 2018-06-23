import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, FormGroup, ControlLabel, Checkbox} from "react-bootstrap";

import { SEARCH, GET_INDEXES } from '../constants/actions';
import Loader from './Loader';

export class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      tags: [],
      people: [],
    };
  }

  render() {
    const filterLabel = this.state.filterOpen ? 'Close Filter' : 'Filter';
    return (
      <Row>
        <Col xs={12}>
          <h2>Search
            <Button onClick={this.toggleFilter} className="pull-right">{filterLabel}</Button>
          </h2>
          {this.state.filterOpen && this.renderFilter()}
        </Col>
      </Row>
    );
  }
  renderFilter(){
    const {
      indexes
    } = this.props;
    if(indexes){
      const showTags = Object.keys(indexes.tags).length > 0;
      const showPeople = Object.keys(indexes.people).length > 0;
      return (<form>
        { showTags && this.renderFilterGroup('Tags', 'tags', indexes.tags) }
        { showPeople && this.renderFilterGroup('People', 'people', indexes.people) }
        <Button onClick={this.handleUpdate} >Update</Button>
      </form>);
    } else {
      return (<Loader alt="Getting filters"/>);
    }
  }

  renderFilterGroup(label, group, filters){
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          {label}
        </Col>
        <Col sm={10}>
        {Object.keys(filters).map(key => (
          <Checkbox
            inline
            key={key}
            checked={this.state[group].includes(key)}
            data-group={group}
            data-key={key}
            onChange={this.onFilterChange}
            >{key} ({filters[key]})</Checkbox>
        ))}
        </Col>
      </FormGroup>
    )
  }

  onFilterChange = (e) =>{
    console.log('filter change', e.target.dataset, e.target.checked)
    const {
      group,
      key
    } = e.target.dataset;
    let updatedGroup = [];
    if(e.target.checked){
      updatedGroup = this.state[group].includes(key) ? this.state[group] : this.state[group].concat(key)
    }else{
      updatedGroup =this.state[group].includes(key) ? this.state[group].filter(k => k !== key) : this.state[group];
    }
    this.setState({
      [group]: updatedGroup
    })
  }

  toggleFilter = () => {
    if(!this.state.filterOpen){
      this.props.getIndexes();
    }
    this.setState({
      filterOpen: !this.state.filterOpen,
    })
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.props.onSearch({
      tags: this.state.tags,
      people: this.state.people,
    });
  }
}

const mapStateToProps = state => {
  return {
    indexes: state.search.indexes
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSearch(payload) {
      dispatch({
        type: SEARCH,
        payload
      });
    },
    getIndexes() {
      dispatch({
        type: GET_INDEXES
      });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchHeader);


