import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Alert } from "react-bootstrap";
import { navigate } from 'redux-saga-first-router';
import styled from 'styled-components';

import SearchHeader from './SearchHeader';
import Loader from './Loader';
import {
  DETAIL
} from '../constants/routes';
import {
  SEARCH
} from '../constants/actions';

const Tile = styled(Col).attrs({
  xs:3,
  sm:2,
  md:1,
})`
  padding-left: 0;
  padding-right: 0;
`;

export class Search extends Component {
  render() {
    const {
      isLoading,
      results,
      searchError
    } = this.props;

    return (
      <Grid>
        <SearchHeader />
        {isLoading && <Loader alt="Searching" />}
        {results && this.renderResults()}
        {searchError && <Alert bsStyle="warning">
          {searchError}
        </Alert>}
        {!isLoading && !results && this.renderSearchPrompt()}
        <pre>
          isLoading: {isLoading ? isLoading.toString() : 'false'}<br />
          results isArray: {Array.isArray(results).toString()}<br />
          results length: {results && results.length}<br />
          searchError: {searchError}
        </pre>
      </Grid>
    );
  }
  renderResults(){
    const {
      results,
      onNavigateDetail
    } = this.props;
    return Array.isArray(results)?
    (<Row>
      {results.map(result => (
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
    (<Row><p>{results}</p></Row>);
  }

  renderSearchPrompt(){
    return (<Alert bsStyle="info">
      Load <a onClick={this.props.onSearch} >latest photos</a>
    </Alert>);
  }
}

const mapStateToProps = state => {
  return {
    isLoading: state.search.isLoading,
    results: state.search.results,
    searchError: state.search.error
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
