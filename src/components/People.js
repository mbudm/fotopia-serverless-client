import React, { Component } from 'react';
import { connect } from 'react-redux';
import { navigate } from 'redux-saga-first-router';
import { HOME } from '../constants/routes';
import { Grid, Row, Col, Alert, FormGroup, FormControl } from 'react-bootstrap';
import styled from 'styled-components';

import Loader from './Loader';

import {
  UPDATE_PERSON,
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
        <h2>People</h2>
        {isLoading && <Loader alt="Getting list of people" className="center-stage" />}
        {results && this.renderResults()}
        {peopleError && <Alert bsStyle="warning">
          {peopleError}
        </Alert>}
      </div>
    );
  }

  renderResults(){
    const {
      results,
      onSearchPerson
    } = this.props;
    return Array.isArray(results)?
      (<Grid>
        <Row>
        {results.map(result => (<Tile key={result.id}>
          <img
            src={result.thumbnail_location}
            alt=""
            className="img-responsive search-tile"
            onClick={onSearchPerson}
            data-id={result.id}
          />
          <FormGroup bsSize="large">
            <FormControl
              autoFocus
              type="text"
              value={this.state.peopleNames[result.id]}
              onChange={this.handleChange}
              onBlur={this.handleBlur}
              data-id={result.id}
            />
            <span>({result.faces.length})</span>
          </FormGroup>
        </Tile>
      ))}
      </Row>
      </Grid>):
      (<Alert bsStyle="info" className="center-stage">{results}</Alert>);
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
    onSearchPerson(e){
      // nneds to navigate also, plus making the img have pointer cursor would be nice
      e.preventDefault();
      const payload = {
        people: [ e.target.dataset.id ]
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

