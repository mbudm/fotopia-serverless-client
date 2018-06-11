import React, { Component } from 'react';
import { connect } from 'react-redux';

import Search from './components/Search';
import Upload from './components/Upload';
import Edit from './components/Edit';
import Detail from './components/Detail';
import Header from './components/Header';
import {
  HOME,
  UPLOAD,
  DETAIL,
  EDIT
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
      [EDIT]: () => <Edit />,
      [DETAIL]: () => <Detail fotoid={params.fotoid}/>,
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
