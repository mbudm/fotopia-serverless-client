import React, { Component } from 'react';
import { connect } from 'react-redux';
import SwipeableViews from 'react-swipeable-views';
import { virtualize } from 'react-swipeable-views-utils';
import { mod } from 'react-swipeable-views-core';

import selectSearchResults from '../selectors/searchResults';

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

export class Detail extends Component {
  render() {
    const {
      results
    } = this.props;

    if(Array.isArray(results)){
      return results.length > 1 ? (
        <div>
          <VirtualizeSwipeableViews slideRenderer={this.renderResult} />
        </div>
      ): this.renderResult({
        index: 0
      });
    }else{
      return (<p> No results </p>);
    }
  }

  renderResult = (params) => {
    const {
      results,
    } = this.props;

    const {
      index
    } = params;
    const idx = mod(index, results.length)
    const result = results[idx];

    return result ? (
      <figure key={result.id}>
        <img
          src={result.img_location}
          className="img-responsive center-block"
          alt=""
        />
        <p>Slide {idx}</p>
      </figure>
    ) : null;
  }
}

const mapStateToProps = (state, ownProps) => {
  const results = selectSearchResults(state);
  const index = results.findIndex((res => res.id === ownProps.fotoid)) || 0;
  const resultsResetToIndex = results.length === 0 ? results : results.slice(index).concat(results.slice(0, index));
  return {
    results: resultsResetToIndex
  }
}

export default connect(
  mapStateToProps,
  null
)(Detail);
