import React, { Component } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';

import DetailHeader from './DetailHeader';
import selectSearchResults from '../selectors/searchResults';

import './detail.css';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

export class Detail extends Component {
  render() {
    const {
      results
    } = this.props;

    if(Array.isArray(results)){
      return (
        <div className="detail-container">
          { results.length > 1 && <VirtualizeSwipeableViews slideRenderer={this.renderResult} /> }
          { results.length === 1 && <div> {this.renderResult({ index: 0 })}</div> }
        </div>
      );
    }else{
      return (<p> No results </p>);
    }
  }

  renderResult = (params) => {
    const {
      results,
      fotoid,
    } = this.props;

    const {
      index
    } = params;
    const idx = mod(index, results.length);
    const result = results[idx];
    const key = `${result.id}-${index}`;

    return result ? (
      <figure key={key} className="detail-image">
        <DetailHeader fotoid={fotoid} />
        <img
          src={result.img_location}
          className="img-responsive center-block"
          alt=""
        />
      </figure>
    ) : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const results = selectSearchResults(state);
  const index = results.items.findIndex((res => res.id === ownProps.fotoid)) || 0;
  const resultsResetToIndex = results.items.length === 0 ? results.items : results.items.slice(index).concat(results.items.slice(0, index));
  return {
    results: resultsResetToIndex
  }
}

export default connect(
  mapStateToProps,
  null
)(Detail);
