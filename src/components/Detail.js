import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

export class Detail extends Component {
  render() {
    const {
      results,
      fotoid
    } = this.props;

    const atts = {
      showArrows: false,
      showThumbs: false,
      infiniteLoop: true,
      selectedItem: Array.isArray(results) ? results.findIndex((res => res.id === fotoid)) : 0
    }

    return (
      <Carousel {...atts} >
        {Array.isArray(results) && results.map(this.renderResult)}
      </Carousel>
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
