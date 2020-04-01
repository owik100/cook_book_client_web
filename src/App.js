import React from 'react';

import Header from '../src/components/Header';
import LoginForm from '../src/components/LoginForm';
import Main from '../src/Main';
import Recipes from '../src/components/Recipes'
import {Authentication} from '../src/helpers/Authentication'
import RecipePreview from '../src/components/RecipePreview'

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
import AddOrEdit from './components/AddOrEdit';

function App() {
  return (
    <div>
      <Router>
            <Header />
        <Switch>
        <Route path="/Login">
            <LoginForm />
          </Route>
          <Route path="/Register">
            <RegisterForm />
          </Route>
          <PrivateRoute path="/Recipes">
            <Recipes />
          </PrivateRoute>
          <Route path="/RecipePreview" render={(props) => <RecipePreview {...props}/>}/>

          <PrivateRoute path="/Edit" >
            <AddOrEdit/>
          </PrivateRoute>

          <PrivateRoute path="/">
          <Recipes />
          </PrivateRoute>
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
      Authentication.isAuthenticated() ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/Login",
              state: { from: location }
            }}
          />
        )
      }
    />
  );
}


export default App;