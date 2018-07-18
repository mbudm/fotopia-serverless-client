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
    (<Alert bsStyle="info" className="center-stage">{results}</Alert>);
  }

  renderSearchPrompt(){
    return (<Alert bsStyle="info" className="center-stage">
      <p>Get latest photos <Button onClick={this.props.onSearch} >Refresh</Button></p>
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
