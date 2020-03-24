import React from 'react'
import { Form, Button } from 'react-bootstrap';
import {Link} from "react-router-dom";

function LoginForm() {
    return (
        <div class="container">
            <div class="row">
                <div class="col">
                    <Form>
                        <h1 className="display-3 text-center mt-5">Logowanie</h1>
                        <Form.Group controlId="formLogin">
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="text" placeholder="Enter login" />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Hasło</Form.Label>
                            <Form.Control type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group controlId="formRemember">
                            <Form.Check type="checkbox" label="Zapamiętaj" />
                        </Form.Group>

                        <Button variant="primary" type="submit">
                            Zaloguj
                        </Button>
                    </Form>
                </div>
            </div>
            <h1 className="lead text-center mt-3">Nie masz jeszcze konta? Zarejestruj się!</h1>
            <Button variant="outline-primary" as={Link} to="/RegisterForm"  >
                Zarejestruj
            </Button>
        </div>
    )
}

export default LoginForm