import React, { Component } from 'react';
import { connect } from "react-redux";
import {
  Row,
  Col,
} from 'react-bootstrap';

import {
  SEARCH,
  GET_INDEXES,
  SEARCH_FILTERS,
  SEARCH_HEADER_TOGGLE
} from "../constants/actions";
import {
  selectIndexCounts,
  selectIndexError,
  selectIndexIsLoading
} from '../selectors/indexes';
import selectPeople from '../selectors/people';
import selectFilters from '../selectors/filters';
import SearchHeaderOpen from './searchHeader/SearchHeaderOpen';
import SearchHeaderClosed from './searchHeader/SearchHeaderClosed';

import './searchHeader.css';

const hasIndexes = ({tags, people}) => {
  return (Array.isArray(tags) && tags.length > 0) ||
    (Array.isArray(people) && people.length > 0);
}

export class SearchHeader extends Component {

  render() {
    return (<Row>
        <Col xs={12} className="filter-tools">
          {this.props.filterOpen &&
          <SearchHeaderOpen
            currentFilters={this.props.currentFilters}
            toggleFilter={this.toggleFilter}
            onSearch={this.props.onSearch}
            indexesError={this.props.indexesError}
            indexesLoading={this.props.indexesLoading}
            tags={this.props.tags}
            people={this.props.people}
          />}
          {!this.props.filterOpen &&
          <SearchHeaderClosed
            currentFilters={this.props.currentFilters}
            currentFilterLabels={this.props.currentFilterLabels}
            toggleFilter={this.toggleFilter}
            onSearch={this.props.onSearch}
          />}
        </Col>
      </Row>
    );
  }

  shouldGetIndexData(){
    return !this.props.filterOpen && !this.props.indexesLoading && !hasIndexes(this.props)
  }

  toggleFilter = () => {
    if(this.shouldGetIndexData()){
      this.props.getIndexes();
    }
    this.props.onSearchHeaderToggle(!this.props.filterOpen)
  }
}


export const getPeopleFilterLabel = (key, people) => {
  const person = people.find(person => person.id === key);
  return person ? person.name : key;
};

export const getFiltersByGroupAndKey = (currentFilters, people) => {
  return Object.keys(currentFilters).reduce((accum, currentGroup) => {
    const groupAsObjects = currentFilters[currentGroup].map(key => ({
      group: currentGroup,
      key,
      label: getPeopleFilterLabel(key, people)
    }));
    return accum.concat(groupAsObjects);
  }, []);
};

const hydratePeopleNames = (peopleIndexes, peopleData) => {
  return peopleIndexes.map(person => {
    const personData = peopleData.find(data => data.id === person.name);
    return {
      ...person,
      name: personData && personData.name
    };
  });
};

const mapStateToProps = state => {
  const currentFilters = selectFilters(state);
  const people = hydratePeopleNames(
    selectIndexCounts(state, "people"),
    selectPeople(state)
  );
  return {
    tags: selectIndexCounts(state, "tags"),
    people,
    indexesError: selectIndexError(state),
    indexesLoading: selectIndexIsLoading(state),
    currentFilters,
    currentFilterLabels: getFiltersByGroupAndKey(
      currentFilters.criteria,
      people
    ),
    filterOpen: state.search.searchHeaderOpen
  };
};

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
    },
    onSearchHeaderToggle(payload){
      dispatch({
        type: SEARCH_HEADER_TOGGLE,
        payload
      });
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SearchHeader);
