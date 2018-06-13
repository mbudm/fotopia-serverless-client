import React, { Component } from 'react';
import { connect } from 'react-redux';
import Hammer from 'react-hammerjs';

export class Detail extends Component {
  render() {
    const {
      handleSwipe,
      results
    } = this.props;

    return (
      <div className="carousel" >
      <Hammer onSwipe={handleSwipe} className="carousel-inner">
        <div>
        {Array.isArray(results) && results.map(this.renderResult)}
        </div>
      </Hammer>
      </div>
    );
  }

  renderResult = (result) => {
    const classNames = result.id === this.props.fotoid ? 'item active' : 'item';
    return (
      <figure key={result.id} className={classNames}>
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
export default connect(
  mapStateToProps,
  null
)(Detail);
