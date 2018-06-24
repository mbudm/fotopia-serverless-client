import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Button, FormGroup, ControlLabel, Checkbox} from "react-bootstrap";

import { SEARCH, GET_INDEXES, SEARCH_FILTERS } from '../constants/actions';
import Loader from './Loader';
import { selectIndexCounts } from '../selectors/indexes';
import selectFilters from '../selectors/filters';

export class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      checked: {
        tags: props.filters.tags,
        people: props.filters.people,
      }
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
      tags,
      people
    } = this.props;

    const showTags = tags.length > 0;
    const showPeople = people.length > 0;
    return showTags || showPeople ? (<form>
      { showTags && this.renderFilterGroup('Tags', 'tags', tags) }
      { showPeople && this.renderFilterGroup('People', 'people', people) }
      <Button onClick={this.handleUpdate} >Update</Button>
    </form>) : (<Loader alt="Getting filters"/>);
  }

  renderFilterGroup(label, group, filters){
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} sm={2}>
          {label}
        </Col>
        <Col sm={10}>
        {filters.map(filter => (
          <Checkbox
            inline
            key={filter.name}
            checked={this.state.checked[group].includes(filter.name)}
            data-group={group}
            data-key={filter.name}
            onChange={this.onFilterChange}
            >{filter.name} ({filter.count})</Checkbox>
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
    const existingGroup = this.state.checked[group];
    let updatedGroup = [];
    if(e.target.checked){
      updatedGroup = existingGroup.includes(key) ? existingGroup : existingGroup.concat(key)
    }else{
      updatedGroup = existingGroup.includes(key) ? existingGroup.filter(k => k !== key) : existingGroup;
    }
    this.setState({
      checked: {
        ...this.state.checked,
        [group]: updatedGroup
      }
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
      tags: this.state.checked.tags,
      people: this.state.checked.people,
    });
  }
}

const mapStateToProps = state => {
  return {
    tags: selectIndexCounts(state, 'tags'),
    people: selectIndexCounts(state, 'people'),
    filters: selectFilters(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onSearch(payload) {
      dispatch({
        type: SEARCH_FILTERS,
        payload
      });
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


