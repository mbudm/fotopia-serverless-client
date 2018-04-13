import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../constants/actions';
import Image from './Image';

class Search extends Component {
  render() {
    const {
      results,
      onGetLatest
    } = this.props;
    return (
      <div>
        <h2>Search</h2>
        <button onClick={onGetLatest}>Get latest photos</button>
        {results && this.renderResults()}
      </div>
    );
  }
  renderResults(){
    const {
      results
    } = this.props;
    return results.length > 0 ?
    (<section className="row" >
      {results.map(result => (
        <figure key={result.id} className="col-md-2 center-block">
          <Image imgKey={result.img_key} imgLocation={result.img_location}/>
        </figure>
      ))}
    </section>):
    (<p>There are no results</p>);
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Search)
