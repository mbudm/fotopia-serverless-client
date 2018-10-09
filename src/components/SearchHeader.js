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
import selectPeople from '../selectors/people';
import selectFilters from '../selectors/filters';

import './searchHeader.css';

const hasIndexes = ({tags, people}) => {
  return (Array.isArray(tags) && tags.length > 0) ||
    (Array.isArray(people) && people.length > 0);
}

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
    return (<Row>
        <Col xs={12} className="filter-tools">
          {!this.state.filterOpen && this.renderFilterClosed()}
          {this.state.filterOpen && this.renderFilterOpen()}
        </Col>
      </Row>
    );
  }

  renderFilterClosed(){
    const { currentFilterLabels } = this.props;
    return (
    <div>
       <Button
        onClick={this.toggleFilter}
        className="pull-right">
        Filter
      </Button>
      { currentFilterLabels.length > 0 && this.renderFilterLabels(currentFilterLabels)}
    </div>);
  }

  renderFilterLabels = (filters) => (<ButtonToolbar >
    {filters.map(filter => (<Button
      bsSize="xsmall"
      key={filter.key}
      data-group={filter.group}
      data-key={filter.key}
      onClick={this.handleFilterButtonClick}>
        {filter.label} <Glyphicon glyph="remove" />
      </Button>))}
  </ButtonToolbar>);

  renderFilterOpen(){
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
      <ButtonToolbar>
          <Glyphicon glyph="remove" onClick={this.toggleFilter} className="pull-right"/>
      </ButtonToolbar>
      <Row>
      { showTags && this.renderFilterGroupOuter('Tags', 'tags', tags, cols) }
      { showPeople && this.renderFilterGroupOuter('People', 'people', people, cols)  }
      </Row>
      <ButtonToolbar className="pull-right">
        <Button onClick={this.toggleFilter} > Close</Button>
        <Button onClick={this.handleUpdate} bsStyle="primary"> Search</Button>
      </ButtonToolbar>
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
        <Col componentClass={ControlLabel} xs={3}>
          {label}
        </Col>
        <Col xs={9}>
        {checkboxes.map(cb => (
          <Checkbox
            key={cb.id}
            checked={this.state.checked[group].includes(cb.id)}
            data-group={group}
            data-key={cb.id}
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
    if(!this.state.filterOpen && !this.props.indexesLoading && !hasIndexes(this.props)){
      this.props.getIndexes();
    }
    this.setState({
      filterOpen: !this.state.filterOpen,
    });
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
    this.toggleFilter();
  }
}

export const getPeopleFilterLabel = (key, people) => {
  const person = people.find(person => person.id === key)
  return person ? person.name : key ;
}

export const getFiltersByGroupAndKey = (currentFilters, people) => {
  return Object.keys(currentFilters)
    .reduce((accum, currentGroup) => {
      const groupAsObjects = currentFilters[currentGroup].map(key =>
        ({group: currentGroup, key, label: getPeopleFilterLabel(key, people)})
      );
      return accum.concat(groupAsObjects);
    }, []);
}

const hydratePeopleNames = ( peopleIndexes, peopleData) => {
  return peopleIndexes.map((person) => {
    const personData = peopleData.find(data => data.id === person.name);
    return {
      ...person,
      name: personData && personData.name
    }
  })
}

const mapStateToProps = state => {
  const currentFilters = selectFilters(state);
  const people = hydratePeopleNames(selectIndexCounts(state, 'people'), selectPeople(state));
  return {
    tags: selectIndexCounts(state, 'tags'),
    people,
    indexesError: selectIndexError(state),
    indexesLoading: selectIndexIsLoading(state),
    currentFilters,
    currentFilterLabels: getFiltersByGroupAndKey(currentFilters, people)
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


