import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Grid, Row, Col, Alert, FormGroup, FormControl } from 'react-bootstrap';

import Loader from './Loader';

import {
  UPDATE_PERSON,
  SEARCH
} from '../constants/actions';


export class People extends Component {
  constructor(props) {
    super(props);
    this.state = {
      peopleNames: {}
    };
    if(Array.isArray(props.results)){
      this.setPeopleNamesState(props);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isLoading === true && nextProps.isLoading === false && Array.isArray(nextProps.results)) {
      this.setPeopleNamesState(nextProps);
    }
  }

  setPeopleNamesState(props){
    const peopleNames = {};
    props.results.forEach(res => {
      peopleNames[res.id] = res.name;
    })
    this.setState({
      peopleNames,
    });
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
        {results.map(result => (<Col key={result.id}>
          <img
            src={result.thumbnail_location}
            alt=""
            className="img-responsive"
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
        </Col>
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
      e.preventDefault();
      const personid = e.target.dataset.id;
      dispatch({
        type: SEARCH,
        payload: {
          people: [ personid ]
        }
      });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(People)

