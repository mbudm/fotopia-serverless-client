import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  Alert,
  Row,
  Col,
  ButtonToolbar,
  Button,
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  Checkbox,
  Glyphicon
} from 'react-bootstrap';

import { SEARCH, GET_INDEXES, SEARCH_FILTERS } from '../constants/actions';
import Loader from './Loader';
import {
  selectIndexCounts,
  selectIndexError,
  selectIndexIsLoading
} from '../selectors/indexes';
import selectFilters from '../selectors/filters';

export class SearchHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
      checked: {
        tags: props.currentFilters.tags,
        people: props.currentFilters.people,
      }
    };
  }

  render() {
    const filterLabel = this.state.filterOpen ? 'Close Filter' : 'Filter';
    const currentFilterLabels = getFiltersByGroupAndKey(this.props.currentFilters);
    return (<Row>
        <Col xs={12}>
          <h2>
            Search
            <Button
              onClick={this.toggleFilter}
              className="pull-right">
              {filterLabel}
            </Button>
            {!this.state.filterOpen && currentFilterLabels.length > 0 && this.renderFilterLabels(currentFilterLabels)}
          </h2>
          {this.state.filterOpen && this.renderFilter()}
        </Col>
      </Row>
    );
  }

  renderFilterLabels = (filters) => (<ButtonToolbar >
    {filters.map(filter => (<Button
      bsSize="xsmall"
      key={filter.key}
      data-group={filter.group}
      data-key={filter.key}
      onClick={this.handleFilterButtonClick}>
        {filter.key} <Glyphicon glyph="remove" />
      </Button>))}
  </ButtonToolbar>);

  renderFilter(){
    const {
      indexesError,
      indexesLoading
    } = this.props;

    return (
      <Panel>
        { indexesLoading && <Loader alt="Getting filters"/> }
        { indexesError && <Alert bsStyle="warning">{indexesError}</Alert> }
        { !indexesError && !indexesLoading && this.renderFilterForm() }
      </Panel>);
  }

  renderFilterForm(){
    const {
      tags,
      people
    } = this.props;
    const showTags = tags.length > 0;
    const showPeople = people.length > 0;
    const countFilterGroups = [showTags, showPeople].reduce((accum, current) => current ? ++accum : accum, 0)
    const cols = Math.floor(12 / countFilterGroups);
    return (<Form horizontal className="panel-body">
      { showTags && this.renderFilterGroupOuter('Tags', 'tags', tags, cols) }
      { showPeople && this.renderFilterGroupOuter('People', 'people', people, cols)  }
      <Button onClick={this.handleUpdate} className="pull-right" >Update</Button>
    </Form>);
  }

  renderFilterGroupOuter(label, group, checkboxes, cols){
    return cols > 1 ? (
      <Col xs={cols}>
        {this.renderFilterGroup(label, group, checkboxes)}
      </Col>) : this.renderFilterGroup(label, group, checkboxes);
  }

  renderFilterGroup(label, group, checkboxes){
    return (
      <FormGroup>
        <Col componentClass={ControlLabel} xs={2}>
          {label}
        </Col>
        <Col xs={10}>
        {checkboxes.map(cb => (
          <Checkbox
            key={cb.name}
            checked={this.state.checked[group].includes(cb.name)}
            data-group={group}
            data-key={cb.name}
            onChange={this.onCheckboxChange}
            >{cb.name} ({cb.count})</Checkbox>
        ))}
        </Col>
      </FormGroup>
    )
  }

  onCheckboxChange = (e) =>{
    console.log('onCheckboxChange change', e.target.dataset, e.target.checked)
    const {
      group,
      key
    } = e.target.dataset;
    const updatedGroup = e.target.checked ?
      this.addToGroup(key, group) :
      this.removeFromGroup(key, group);

    this.setState({
      checked: {
        ...this.state.checked,
        [group]: updatedGroup
      }
    });
  }

  addToGroup = (key, group) => {
    const existingGroup = this.state.checked[group];
    return existingGroup.includes(key) ? existingGroup : existingGroup.concat(key)
  }

  removeFromGroup = (key, group) => {
    const existingGroup = this.state.checked[group];
    return existingGroup.includes(key) ? existingGroup.filter(k => k !== key) : [...existingGroup];
  }

  toggleFilter = () => {
    if(!this.state.filterOpen){
      this.props.getIndexes();
    }
    this.setState({
      filterOpen: !this.state.filterOpen,
    })
  }

  handleFilterButtonClick =(e) => {
    e.preventDefault();
    const {
      group,
      key
    } = e.currentTarget.dataset;
    const filtersUpdate = {
      ...this.state.checked,
      [group]: this.removeFromGroup(key, group)
    };
    this.setState({
      checked: filtersUpdate
    });
    this.props.onSearch(filtersUpdate);
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.props.onSearch({
      tags: this.state.checked.tags,
      people: this.state.checked.people,
    });
  }
}

export const getFiltersByGroupAndKey = (currentFilters) => {
  return Object.keys(currentFilters)
    .reduce((accum, currentGroup) => {
      const groupAsObjects = currentFilters[currentGroup].map(key =>
        ({group: currentGroup, key})
      );
      return accum.concat(groupAsObjects);
    }, []);
}

const mapStateToProps = state => {
  return {
    tags: selectIndexCounts(state, 'tags'),
    people: selectIndexCounts(state, 'people'),
    indexesError: selectIndexError(state),
    indexesLoading: selectIndexIsLoading(state),
    currentFilters: selectFilters(state),
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


