import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from 'redux-saga-first-router';
import { HOME } from '../constants/routes';
import { Grid, Row, Col, Alert, FormGroup, FormControl, Button } from 'react-bootstrap';
import styled from 'styled-components';

import Loader from './Loader';

import {
  UPDATE_PERSON,
  MERGE_PEOPLE,
  SEARCH,
  SEARCH_FILTERS
} from '../constants/actions';

import './people.css';

const Tile = styled(Col).attrs({
  xs:4,
  sm:3,
  md:2,
})`
  padding-left: 0;
  padding-right: 0;
`;

const getPeopleNamesFromProps = (props) => {
  const peopleNames = {};
  if(Array.isArray(props.results)){
    props.results.forEach(res => {
      peopleNames[res.id] = res.name;
    });
  }
  return peopleNames;
}

export class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleNames: getPeopleNamesFromProps(props),
      peopleSelected: {}
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading === true && nextProps.isLoading === false && Array.isArray(nextProps.results)) {
      this.setState({
        peopleNames: getPeopleNamesFromProps(nextProps)
      });
    }
  }

  render() {
    const {
      isLoading,
      results,
      peopleError
    } = this.props;
    return (
      <div>
        <h2>People
        <Button
          onClick={this.mergeSelected}
          className="pull-right">
          Merge Selected
        </Button>
        </h2>
        {isLoading && <Loader alt="Getting list of people" className="center-stage" />}
        {results && this.renderResults()}
        {peopleError && <Alert bsStyle="warning">
          {peopleError}
        </Alert>}
      </div>
    );
  }

  getImageFilename(key){
    const filePath = key.split('/');
    return filePath[filePath.length - 1];
  }
  renderResults(){
    const {
      results,
      onSearchPerson
    } = this.props;

    return Array.isArray(results)?
      (<Grid className="people-grid">
        <Row>
        {results.map(result => (<Tile key={result.id}>
          <figure className="search-tile-wrapper">
            <img
              src={result.thumbnail_location}
              alt=""
              className="img-responsive search-tile"
              onClick={onSearchPerson}
              data-id={result.id}
            />
            <FormGroup bsSize="small">
              <FormControl
                type="checkbox"
                value={this.state.peopleSelected[result.id]}
                onChange={this.handleCheckboxChange}
                data-id={result.id}
                className="search-tile-cb"
              />
              <FormControl
                autoFocus
                type="text"
                value={this.state.peopleNames[result.id]}
                onChange={this.handleChange}
                onBlur={this.handleBlur}
                data-id={result.id}
                className="search-tile-text"
              />
              <span className="search-tile-count">
              {result.faces.length}
              </span>
            </FormGroup>
          </figure>
        </Tile>
      ))}
      </Row>
      </Grid>):
      (<Alert bsStyle="info" className="center-stage">{results}</Alert>);
  }

  handleCheckboxChange = event => {
    const peopleSelected = {
      ...this.state.peopleSelected,
      [event.target.dataset.id]: event.target.checked
    };
    this.setState({
      peopleSelected
    });
  }

  handleChange = event => {
    const peopleNames = {
      ...this.state.peopleNames,
      [event.target.dataset.id]: event.target.value
    }
    this.setState({
      peopleNames
    });
  }

  handleBlur = e => {
    e.preventDefault();
    const result = findResult(e.target.dataset.id, this.props.results);
    if (result && (e.target.value !== result.name)) {
      const payload = {
        id: e.target.dataset.id,
        name: e.target.value
      }
      this.props.onEditPerson(payload);
    }
  }

  mergeSelected = e => {
    e.preventDefault();
    const payload = Object.keys(this.state.peopleSelected).filter(key => this.state.peopleSelected[key]);
    this.props.onMergePeople(payload);
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.people.isLoading,
    results: state.people.results,
    peopleError: state.people.error
  }
}

const findResult = (id, results) => {
  return Array.isArray(results)? results.find(result => result.id === id) : undefined ;
}

const mapDispatchToProps = dispatch => {
  return {
    onEditPerson(payload){
      dispatch({type: UPDATE_PERSON, payload});
    },
    onMergePeople(payload){
      dispatch({type: MERGE_PEOPLE, payload});
    },
    onSearchPerson(e){
      e.preventDefault();
      const payload = {
        criteria: {
          people: [ e.target.dataset.id ]
        }
      };
      dispatch({
        type: SEARCH_FILTERS,
        payload
      });
      dispatch({
        type: SEARCH,
        payload,
      });
      dispatch(navigate(HOME));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(People)

