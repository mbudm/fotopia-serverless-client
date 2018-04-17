import React, { Component } from 'react';
import { connect } from 'react-redux';

import Search from './components/Search';
import Upload from './components/Upload';
import Create from './components/Create';
import Edit from './components/Edit';
import Header from './components/Header';

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
    const {routing: {id}} = this.props;
    const routes = {
      UPLOAD: () => <Upload />,
      CREATE: () => <Create />,
      EDIT: () => <Edit />,
      HOME: () => <Search />,
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
