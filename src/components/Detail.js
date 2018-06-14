import React, { Component } from 'react';
import { connect } from 'react-redux';
import ReactSwipe from 'react-swipe';

export class Detail extends Component {
  render() {
    const {
      results,
      fotoid
    } = this.props;

    const atts = {
      continuous: true,
      startSlide: Array.isArray(results) ? results.findIndex((res => res.id === fotoid)) : 0
    }

    return (
      <ReactSwipe swipeOptions={atts} >
        {Array.isArray(results) && results.map(this.renderResult)}
      </ReactSwipe>
    );
  }

  renderResult = (result) => {

    return (
      <figure key={result.id}>
        <img
          src={result.img_location}
          className="img-responsive center-block"
          alt=""
        />
      </figure>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    results: state.search.results
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onPan(e) {
      console.log('swipe', e)
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Detail);
