import React from 'react';

import Header from '../src/components/Header';
import LoginForm from '../src/components/LoginForm';
import Main from '../src/Main';
import Recipes from '../src/components/Recipes'
import {Authentication} from '../src/helpers/Authentication'

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
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
          <PrivateRoute path="/Recipes">
            <Recipes />
          </PrivateRoute>
          <Route path="/">
            <Main />
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

function PrivateRoute({ children, ...rest }) {
  return (
    <Route
      {...rest}
      render={({ location }) =>
      Authentication.isAuthenticated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/LoginForm",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


export default App;
{/* <Link to="/">Home</Link> */ }