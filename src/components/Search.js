import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Alert, Button } from "react-bootstrap";
import { navigate } from 'redux-saga-first-router';
import styled from 'styled-components';

import SearchHeader from './SearchHeader';
import Loader from './Loader';
import {
  DETAIL
} from '../constants/routes';
import {
  SEARCH,
  SEARCH_HEADER_TOGGLE,
  SEARCH_FILTERS
} from '../constants/actions';
import {
  MAX_SEARCH_DURATION_MS
} from '../constants/search';
import selectFilters from '../selectors/filters';

const Tile = styled(Col).attrs({
  xs:3,
  sm:2,
  md:1,
})`
  padding-left: 0;
  padding-right: 0;
`;

export class Search extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOpen: false,
    };
  }

  render() {
    const {
      isLoading,
      results,
      searchError
    } = this.props;

    return (
      <Grid>
        <SearchHeader />
        {isLoading && <Loader alt="Searching" className="center-stage" />}
        {results && this.renderResults()}
        {searchError && <Alert bsStyle="warning">
          {searchError}
        </Alert>}
        {!isLoading && !results && this.renderSearchPrompt()}
      </Grid>
    );
  }
  renderResults(){
    const {
      results,
      onNavigateDetail
    } = this.props;
    return results.items.length > 0?
    (<Row>
      {results.items.map((result) => (
        <Tile key={result.id}>
          <img
            src={result.img_thumb_location}
            alt=""
            className="img-responsive"
            onClick={onNavigateDetail}
            data-id={result.id}
          />
        </Tile>
      ))}
    </Row>):
    (
      <Alert bsStyle="info" className="center-stage">
        <p>{results.message}</p>
        <p>
          Try different&nbsp;
          <Button bsSize="small" onClick={this.props.onOpenSearchFilter}>filters</Button>
          &nbsp;or&nbsp;
          <Button bsSize="small" onClick={this.searchOlder}>search for older photos</Button>
        </p>
      </Alert>
    );
  }

  renderSearchPrompt(){
    return (<Alert bsStyle="info" className="center-stage">
      <p>Get latest photos <Button onClick={this.props.onSearch} >Refresh</Button></p>
    </Alert>);
  }

  searchOlder = () => {
    const updatedFilters ={
      ...this.props.currentFilters,
      from: this.props.currentFilters.from - MAX_SEARCH_DURATION_MS,
      to: this.props.currentFilters.from
    }
    this.props.onSearchOlder(updatedFilters)
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.search.isLoading,
    results: state.search.results,
    searchError: state.search.error,
    currentFilters: selectFilters(state)
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onNavigateDetail(e){
      e.preventDefault();
      const fotoid = e.target.dataset.id;
      dispatch(navigate(DETAIL, {fotoid}));
    },
    onSearch(e){
      e.preventDefault();
      dispatch({type: SEARCH});
    },
    onOpenSearchFilter(e){
      e.preventDefault();
      dispatch({type: SEARCH_HEADER_TOGGLE, payload:true});
    },
    onSearchOlder(payload){
      dispatch({
        type: SEARCH_FILTERS,
        payload
      });
      dispatch({
        type: SEARCH
      });
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
