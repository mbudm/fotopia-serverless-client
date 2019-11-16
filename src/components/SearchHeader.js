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
  FormControl,
  FormGroup,
  ControlLabel,
  Glyphicon
} from 'react-bootstrap';

import { SEARCH, GET_INDEXES, SEARCH_FILTERS } from '../constants/actions';
import { MAX_SEARCH_DURATION_MS, CRITERIA, INDEXES } from '../constants/search';
import Loader from './Loader';
import {
  selectIndexCounts,
  selectIndexError,
  selectIndexIsLoading
} from '../selectors/indexes';
import selectPeople from '../selectors/people';
import selectFilters from '../selectors/filters';
import Tags from './Tags';

import './searchHeader.css';

const hasIndexes = ({tags, people}) => {
  return (Array.isArray(tags) && tags.length > 0) ||
    (Array.isArray(people) && people.length > 0);
}
const formatDateString = (dateMs) =>{
  const date =  new Date(dateMs);
  return date.toISOString().substring(0,10)
}
export class SearchHeader extends Component {
  constructor(props) {
    super(props);
    const to = props.currentFilters.to || Date.now()
    const from = props.currentFilters.from || to - MAX_SEARCH_DURATION_MS
    this.state = {
      filterOpen: false,
      criteria: props.currentFilters.criteria,
      from: formatDateString(from),
      to: formatDateString(to)
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
    // const countFilterGroups = [showTags, showPeople].reduce((accum, current) => current ? ++accum : accum, 0)
    return (<Form horizontal className="panel-body">
      <ButtonToolbar>
        <Glyphicon glyph="remove" onClick={this.toggleFilter} className="pull-right"/>
      </ButtonToolbar>
      {this.renderDateFields()}
      { showTags && this.renderFilterGroup('Tags', 'tags', tags) }
      { showPeople && this.renderFilterGroup('People', 'people', people)  }
      <ButtonToolbar className="pull-right">
        <Button onClick={this.toggleFilter} > Close</Button>
        <Button onClick={this.handleUpdate} bsStyle="primary"> Search</Button>
      </ButtonToolbar>
    </Form>);
  }

  renderFilterGroup(label, group, indexData){
    const suggestedTags = indexData
      .filter(indexItem => indexItem.name && indexItem.name.length > 1)
      .map(indexItem => indexItem.name)
    return suggestedTags.length > 1 ? (
      <FormGroup>
        <Col xs={12}>
          <Tags
            id={group}
            title={label}
            placeholder={`Filter by ${group}`}
            tagKey={group}
            suggestedTags={suggestedTags}
            onTagUpdate={this.handleFilterGroupUpdate}/>
        </Col>
      </FormGroup>
    ) : null ;
  }

  renderDateFields(){
    return (
      <FormGroup>
        <Col xs={6}>
          <FormGroup controlId="from">
            <Col componentClass={ControlLabel} xs={3}>
              From
            </Col>
            <Col xs={9}>
              <FormControl
                type="date"
                value={this.state.from}
                onChange={this.handleDateChange}
              />
            </Col>
          </FormGroup>
        </Col>
        <Col xs={6}>
          <FormGroup controlId="to">
            <Col componentClass={ControlLabel} xs={3}>
              To
            </Col>
            <Col xs={9}>
              <FormControl
                type="date"
                value={this.state.to}
                onChange={this.handleDateChange}
              />
            </Col>
          </FormGroup>
        </Col>
      </FormGroup>
    )
  }

  handleFilterGroupUpdate = (id, tagKey, tags) => {
    const updatedFilterCriteria = {
      ...this.state.criteria
    }
    if(tagKey === CRITERIA[INDEXES.TAGS]){
      updatedFilterCriteria[tagKey] = tags;
    } else if(tagKey === CRITERIA[INDEXES.PEOPLE]){
      const peopleIndexes = this.props.people
        .filter(person => tags.includes(person.name))
        .map(person => person.id)
      updatedFilterCriteria[tagKey] = peopleIndexes;
    }
    this.setState({
      criteria: updatedFilterCriteria
    });
  }

  removeFromGroup = (key, group) => {
    const existingGroup = this.state.criteria[group];
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
      ...this.state.criteria,
      [group]: this.removeFromGroup(key, group)
    };
    this.setState({
      criteria: filtersUpdate
    });
    this.props.onSearch(filtersUpdate);
  }

  handleDateChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleUpdate = (e) => {
    e.preventDefault();
    this.props.onSearch({
      criteria: {
        tags: this.state.criteria.tags,
        people: this.state.criteria.people,
      },
      from: new Date(this.state.from).getTime(),
      to: new Date(this.state.to).getTime(),
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
    currentFilterLabels: getFiltersByGroupAndKey(currentFilters.criteria, people)
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


