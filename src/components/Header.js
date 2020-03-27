import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import { Link, useHistory, } from "react-router-dom";
import { Authentication } from '../helpers/Authentication'



function AuthButton() {
    let history = useHistory();
    return Authentication.isAuthenticated() ? (

        <Nav.Link
            onClick={() => {
                Authentication.LogOut(() => history.push("/"));

            }}
            as={Link} to="/Login">
            Wyloguj
          </Nav.Link>
    ) : (
            <Nav.Link as={Link} to="/Login">
                Zaloguj się
     </Nav.Link>
        );
}

function GetName() {
    if (Authentication.LoadUserName() != null && Authentication.isAuthenticated()) {
        return (
            <Navbar.Text>
                Witaj {Authentication.LoadUserName()}
            </Navbar.Text>
        )
    }
    else {
        return null;
    }
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

                    </Nav>
                    <Nav className="justify-content-end">
                        {GetName()}
                        {AuthButton()}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

export default Header