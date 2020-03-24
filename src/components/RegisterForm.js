import React from 'react'
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";

function RegisterForm() {
    return (
        <div class="container">
            <div class="row">
                <div class="col">
                    <Form>
                        <h1 className="display-3 text-center mt-5">Rejestracja</h1>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Email</Form.Label>
                            <Form.Control type="email" placeholder="Email" />
                        </Form.Group>

                        <Form.Group controlId="formLogin">
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="text" placeholder="Enter login" />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Hasło</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="formPasswordRepeat">
                            <Form.Label>Powtórz hasło</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                           Zarejestruj
                        </Button>
                    </Form>
                </div>
            </div>
            <Button variant="outline-primary" as={Link} to="/LoginForm" className="mt-3"  >
                Wróć
            </Button>
        </div>
    )
}

export default RegisterForm