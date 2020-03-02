import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Application from './components/Application';

ReactDOM.render(
  <Router>
    <Application>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/home" component={Home} />
      </Switch>
    </Application>
  </Router>,
  document.getElementById('root'),
);
