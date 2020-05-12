import React, { Fragment } from 'react'

import Header from '../src/components/Header';
import LoginForm from '../src/components/LoginForm';
import Main from '../src/Main';
import Recipes from '../src/components/Recipes'
import { Authentication } from '../src/helpers/Authentication'
import RecipePreview from '../src/components/RecipePreview'
import About from '../src/components/About'

import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';

import {
  HashRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation,
} from "react-router-dom";

import ScrollToTop from '../src/helpers/ScrollToTop'

import RegisterForm from './components/RegisterForm';
import AddOrEdit from './components/AddOrEdit';

function App() {
  return (
    <div>
      <Router>
      <Fragment>
      <ScrollToTop />
        <Header />
        <Switch>

          <Route path="/Login" component={LoginForm} />

          <Route path="/Register" component={RegisterForm} />

          <Route path="/About" component={About} />

          <PrivateRoute path="/UserRecipes" component={Recipes} />

          <PrivateRoute path="/PublicRecipes" component={Recipes} />

          <PrivateRoute path="/FavouritesRecipes" component={Recipes} />


          <PrivateRoute path="/RecipePreview/:id" component={RecipePreview} />

          <PrivateRoute path="/Edit/:id" component={AddOrEdit} />}/>

          <PrivateRoute path="/" component={Recipes} />

        </Switch>
        </Fragment>
      </Router>
    </div>
  );
}


const PrivateRoute = ({ component: Component, exact, strict, path, ...rest }) => (
  <Route {...rest} render={(props) => (
    Authentication.isAuthenticated()
      ? <Component {...props} />
      : <Redirect to={{
        pathname: '/Login',
        state: { from: props.location }
      }} />
  )} />
)

// function PrivateRoute({ children, ...rest }) {
//   return (
//     <Route
//       {...rest}
//       render={({ location }) =>
//       Authentication.isAuthenticated() ? (
//           children
//         ) : (
//           <Redirect
//             to={{
//               pathname: "/Login",
//               state: { from: location }
//             }}
//           />
//         )
//       }
//     />
//   );
// }


export default App;