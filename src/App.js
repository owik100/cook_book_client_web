import React from 'react';

import Header from '../src/components/Header';
import LoginForm from '../src/components/LoginForm';
import Main from '../src/Main';

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import RegisterForm from './components/RegisterForm';

function App() {
  return (
    <div>
      <Router>
            <Header />
        <Switch>
          <Route path="/LoginForm">
            <LoginForm />
          </Route>
          <Route path="/RegisterForm">
            <RegisterForm />
          </Route>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
{/* <Link to="/">Home</Link> */ }