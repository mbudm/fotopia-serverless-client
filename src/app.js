import React, { Component } from 'react';
import { BrowserRouter as Route, Link } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import Search from './components/Search';
import Upload from './components/Upload';
import Edit from './components/Edit';

class App extends Component {
  render() {
    console.log('Yo', this.props);
    return (
      <ConnectedRouter history={this.props.history}>
      <div>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/upload">Upload</Link>
          </li>
          <li>
            <Link to="/edit">Manage</Link>
          </li>
        </ul>
        <hr />
        <Route exact path="/" component={Search} />
        <Route path="/upload" component={Upload} />
        <Route path="/edit" component={Edit} />

        </div>
      </ConnectedRouter>
    );
  }
}

export default App;
