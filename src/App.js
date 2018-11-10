import React, { Component } from 'react';
import { connect } from 'react-redux';

import Search from './components/Search';
import Upload from './components/Upload';
import Detail from './components/Detail';
import People from './components/People';
import Header from './components/Header';
import {
  HOME,
  UPLOAD,
  DETAIL,
  PEOPLE
} from './constants/routes';

class App extends Component {
  render() {
    return (
      <div>
        <Header />
        {this.renderRoute()}
      </div>
    );
  }

  renderRoute(){
    const {routing: {id, params}} = this.props;
    const routes = {
      [UPLOAD]: () => <Upload />,
      [DETAIL]: () => <Detail fotoid={params.fotoid}/>,
      [PEOPLE]: () => <People />,
      [HOME]: () => <Search />,
    }
    return routes[id] ? routes[id]() : (<Search />);
  }
}

const mapStateToProps = state => {
  return {
    routing: state.router
  }
}

export default connect(
  mapStateToProps,
  null
)(App)
