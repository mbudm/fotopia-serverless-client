import React, { Component } from 'react';
import {
  Alert,
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

import { MAX_SEARCH_DURATION_MS, CRITERIA, INDEXES } from '../../constants/search';
import Loader from '../Loader';

import Tags from '../Tags';


const formatDateString = (dateMs) =>{
  const date =  new Date(dateMs);
  return date.toISOString().substring(0,10)
}
export class SearchHeaderOpen extends Component {
  constructor(props) {
    super(props);
    const to = props.currentFilters.to || Date.now()
    const from = props.currentFilters.from || to - MAX_SEARCH_DURATION_MS
    this.state = {
      criteria: {
        tags: [...props.currentFilters.criteria.tags],
        people: [...props.currentFilters.criteria.people],
      },
      from: formatDateString(from),
      to: formatDateString(to)
    };
  }

  render() {
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

    return (<Form horizontal className="panel-body">
      <ButtonToolbar className="search-header-open--toolbar">
        <Glyphicon glyph="remove" onClick={this.props.toggleFilter} className="pull-right"/>
      </ButtonToolbar>
      {this.renderDateFields()}
      { showTags && this.renderFilterGroup('Tags', CRITERIA[INDEXES.TAGS]) }
      { showPeople && this.renderFilterGroup('People', CRITERIA[INDEXES.PEOPLE])  }
      <ButtonToolbar className="pull-right">
        <Button onClick={this.props.toggleFilter} > Close</Button>
        <Button onClick={this.handleUpdate} bsStyle="primary"> Search</Button>
      </ButtonToolbar>
    </Form>);
  }

  renderFilterGroup(label, group){
    const suggestedTags = this.props[group]
      .filter(indexItem => indexItem.name && indexItem.name.length > 1)
    return suggestedTags.length > 1 ? (
      <FormGroup>
        <Col xs={12}>
          <Tags
            id={group}
            title={label}
            tags={this.state.criteria[group]}
            placeholder={`Filter by ${group}`}
            tagKey={group}
            suggestedTags={suggestedTags}
            onTagUpdate={this.handleFilterGroupUpdate}
            />
        </Col>
      </FormGroup>
    ) : null ;
  }

  renderDateFields(){
    return (
      <FormGroup>
        <Col xs={12} sm={6}>
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
        <Col xs={12} sm={6}>
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

  handleDateChange = event => {
    this.setState({
      [event.target.id]: event.target.value
    });
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
    this.props.toggleFilter();
  }
}

export default SearchHeaderOpen;

