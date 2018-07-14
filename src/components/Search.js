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
      results,
      searchError,
      serviceWorkerUpdated
    } = this.props;
    return (
      <Grid>
        <SearchHeader />
        {results ? this.renderResults() : <Loader alt="Searching" /> }
        {searchError && <Alert bsStyle="warning">
          {searchError}
        </Alert>}
        {serviceWorkerUpdated && <Alert bsStyle="info">
          Service worker updated
        </Alert>}
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
}
const mapStateToProps = state => {
  return {
    results: state.search.results,
    searchError: state.search.error,
    serviceWorkerUpdated: state.cache.serviceWorkerUpdated
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onNavigateDetail(e){
      e.preventDefault();
      const fotoid = e.target.dataset.id;
      dispatch(navigate(DETAIL, {fotoid}));
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
