import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import {Link, useHistory,} from "react-router-dom";
import {Authentication} from '../helpers/Authentication'



function AuthButton() {
    let history = useHistory();
  
    return Authentication.isAuthenticated() ? (

        <Nav.Link 
          onClick={() => {
            Authentication.DeleteToken(() => history.push("/"));
             
          }}
          as={Link} to="/LoginForm">
          Wyloguj
          </Nav.Link>

    ) : (
     <Nav.Link  as={Link} to="/LoginForm">
         Zaloguj się
     </Nav.Link>
    );
  }

function Header() {
    return (
        <header>
            <Navbar variant="dark" bg="primary" sticky="top" expand="lg">
                <Navbar.Brand as={Link} to="/">Cook Book</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/" >Home</Nav.Link>
                        <Nav.Link as={Link} to="/Recipes" >Przepisy</Nav.Link>
                         {AuthButton()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

export default Header