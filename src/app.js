import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Search from './components/Search';
import Upload from './components/Upload';
import Edit from './components/Edit';

class App extends Component {
  render() {
    return (
      <Router>
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
      </Router>
    );
  }
}

export default App;
