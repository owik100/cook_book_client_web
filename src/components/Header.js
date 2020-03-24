import React from 'react'
import { Navbar, Nav } from 'react-bootstrap';
import {Link} from "react-router-dom";


function Header() {
    return (
        <header>
            <Navbar variant="dark" bg="primary" sticky="top" expand="lg">
                <Navbar.Brand as={Link} to="/">Cook Book</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link as={Link} to="/" >Home</Nav.Link>
                        <Nav.Link as={Link} to="/LoginForm" >Zaloguj</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </header>
    )
}

export default Header