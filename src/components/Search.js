import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SEARCH } from '../constants/actions';

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
    (<ul>
      {results.map(result => (
        <li key={result.id}>
          <img src={result.location} />
        </li>
      ))}
    </ul>):
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
