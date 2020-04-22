import React, { Component } from 'react'
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import { Authentication } from "../helpers/Authentication"
import { APIHelper } from '../API/APIHelper';

class LoginForm extends Component {

    constructor() {
        super()
        this.state = {
            Login: "",
            Password: "",
            RememberMe: false,
            InfoMessage: "",
            DuringOperation: false,
            isLogged: false,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    componentDidMount() {
        if (Authentication.isAuthenticated()) {
            this.setState({ isLogged: true })
        }
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleCheckboxChange = event =>
    this.setState({ RememberMe: event.target.checked })

    handleSubmit(event) {
        this.setState({ DuringOperation: true })

        let result = APIHelper.LogIn(this.state.Login, this.state.Password)
        result.then(data => {
            console.log("Zalogowano")
            this.setState({ InfoMessage: "" })
            this.setState({ DuringOperation: false })

            Authentication.SaveToken(data.access_Token, this.state.RememberMe)
            this.GetUserData();
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
                    this.setState({ InfoMessage: 'Problem z połączeniem' })
                    this.setState({ DuringOperation: false })
                }
                else {
                    try {
                        var obj = JSON.parse(error)
                        console.log(obj.message)
                        this.setState({ InfoMessage: obj.message })
                        this.setState({ DuringOperation: false })
                    }
                    //Another problem...
                    catch (error) {
                        console.log(error);
                    }
                }
            })

        event.preventDefault();
    }

    GetUserData() {
        let result = APIHelper.GetUserData()

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            console.log(data)
            Authentication.SaveUserData(data);
            this.setState({ isLogged: true })
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
                    this.setState({ InfoMessage: 'Problem z połączeniem' })
                    this.setState({ DuringOperation: false })
                }
                else {
                    try {
                        var obj = JSON.parse(error)
                        console.log(obj.message)
                        this.setState({ InfoMessage: obj.message })
                        this.setState({ DuringOperation: false })
                    }
                    //Another problem...
                    catch (error) {
                        console.log(error);
                    }
                }
            })
    }

    LoginMessage() {
        if (this.state.DuringOperation) {
            return (
                <div class="d-flex justify-content-center">
                    <Spinner animation="grow" variant="primary" role="status">
                        <span className="sr-only my-auto mx-auto">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        else {
            if (this.state.InfoMessage != "") {
                return (
                    <Alert className="text-center" variant="danger">
                    {this.state.InfoMessage}
                </Alert>
                );
            }
            else {
                return null
            }
        }
    }

    render() {
        if (this.state.isLogged === true) {
            return <Redirect to='/Recipes' />
        }

        return (
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Form onSubmit={this.handleSubmit}>
                            <h1 className="display-3 text-center mt-5">Logowanie</h1>

                            {this.LoginMessage()}

                            <Form.Group controlId="formLogin">
                                <Form.Label>Login</Form.Label>
                                <Form.Control type="text" required placeholder="Enter login" name="Login" onChange={this.handleChange} value={this.state.Login} />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Hasło</Form.Label>
                                <Form.Control type="password" required placeholder="Password" name="Password" onChange={this.handleChange} value={this.state.Password} />
                            </Form.Group>

                            <Form.Group controlId="formRemember">
                                <Form.Check type="checkbox" label="Zapamiętaj" name="RememberMe" onChange={this.handleCheckboxChange} checked={this.state.RememberMe} />
                            </Form.Group>

                            <div class="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Zaloguj
                        </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <h1 className="lead text-center mt-3">Nie masz jeszcze konta? Zarejestruj się!</h1>
                <div class="d-flex justify-content-center">
                    <Button variant="outline-primary" as={Link} to="/Register"  >
                        Zarejestruj
            </Button>
                </div>
            </div>
        )
    }
}

export default LoginForm