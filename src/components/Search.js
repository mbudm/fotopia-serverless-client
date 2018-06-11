import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col, Button } from "react-bootstrap";
import { navigate } from 'redux-saga-first-router';

import { SEARCH } from '../constants/actions';
import {
  DETAIL
} from '../constants/routes';

export class Search extends Component {
  render() {
    const {
      results,
      onGetLatest
    } = this.props;
    return (
      <Grid>
        <Row>
          <Col xs={12}>
            <h2>Search
              <Button onClick={onGetLatest} className="pull-right">Get latest photos</Button>
            </h2>
          </Col>
        </Row>
        {results ? this.renderResults() : this.renderLoader() }
      </Grid>
    );
  }
  renderLoader = () => (<img src="loader.svg" alt="searching"/>);
  renderResults(){
    const {
      results,
      onNavigateDetail
    } = this.props;
    return Array.isArray(results)?
    (<Row>
      {results.map(result => (
        <Col key={result.id} xs={3} sm={2} md={1}>
          <img
            src={result.img_thumb_location}
            alt=""
            className="img-responsive"
            onClick={onNavigateDetail}
            data-id={result.id}
          />
        </Col>
      ))}
    </Row>):
    (<Row><p>{results}</p></Row>);
  }
}
const mapStateToProps = state => {
  return {
    results: state.search.results
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onGetLatest(e) {
      e.preventDefault();
      dispatch({
        type: SEARCH
      });
    },
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
