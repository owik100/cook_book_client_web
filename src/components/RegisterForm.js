import React, { Component } from 'react'
import { Form, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { APIHelper } from '../API/APIHelper';

class RegisterForm extends Component {

    constructor() {
        super()
        this.state = {
            Email: "",
            Login: "",
            Password: "",
            ConfirmPassword: "",
            InfoMessage: "",
            InfoMessageIsError: false,
            DuringOperation: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {
        if (this.CanRegister()) {
            this.setState({ DuringOperation: true })

            let result = APIHelper.Register(this.state.Email, this.state.Login, this.state.Password, this.state.ConfirmPassword);
            result.then(data => {
                console.log("Rejestracja pomyślna! Możesz teraz się zalogować.")
                this.setState({ InfoMessage: "Rejestracja pomyślna! Możesz teraz się zalogować." })
                this.setState({ InfoMessageIsError: false })
                this.setState({ DuringOperation: false })
                this.ClearForm();
            })
                .catch(error => {
                    //Connection problem
                    if (error == "TypeError: response.text is not a function") {
                        console.log('Problem z połączeniem')
                        this.setState({ InfoMessageIsError: true })
                        this.setState({ InfoMessage: 'Problem z połączeniem' })
                        this.setState({ DuringOperation: false })
                    }
                    else {
                        try {
                            var obj = JSON.parse(error)
                            console.log(obj.message)
                            this.setState({ InfoMessageIsError: true })
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
        event.preventDefault();
    }

    CanRegister() {
        let output = false;
        if (this.state.Email && this.state.Login && this.state.Password && this.state.ConfirmPassword && !this.state.DuringOperation) {
            if (this.state.Password === this.state.ConfirmPassword) {
                output = true;
                this.setState({ InfoMessageIsError: false })
                this.setState({ InfoMessage: "" })
            }
            else {
                this.setState({ InfoMessageIsError: true })
                this.setState({ InfoMessage: "Hasła nie są takie same" })
            }
        }
        return output;
    }

    ClearForm() {
        document.getElementById("registerForm").reset();

        this.setState({ Email: "" })
        this.setState({ Login: "" })
        this.setState({ Password: "" })
        this.setState({ ConfirmPassword: "" })
    }

    RegisterMessage() {
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
            if (this.state.InfoMessage != "" && this.state.InfoMessageIsError == false) {
                return (

                    <Alert className="text-center" variant="success">
                        {this.state.InfoMessage}
                    </Alert>
                );
            }
            else if (this.state.InfoMessage != "" && this.state.InfoMessageIsError == true) {
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
        return (
            <div class="container">
                <div class="row">
                    <div class="col">

                        <Form id="registerForm" onSubmit={this.handleSubmit}>
                            <h1 className="display-3 text-center mt-5">Rejestracja</h1>

                            {this.RegisterMessage()}

                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="Email" required onChange={this.handleChange} value={this.state.Email} />
                            </Form.Group>

                            <Form.Group controlId="formLogin">
                                <Form.Label>Login</Form.Label>
                                <Form.Control type="text" placeholder="Enter login" name="Login" required onChange={this.handleChange} value={this.state.Login} />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Hasło</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="Password" required onChange={this.handleChange} value={this.state.Password} />
                            </Form.Group>

                            <Form.Group controlId="formPasswordRepeat">
                                <Form.Label>Powtórz hasło</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="ConfirmPassword" required onChange={this.handleChange} value={this.state.ConfirmPassword} />
                            </Form.Group>
                            <div class="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Zarejestruj
                         </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                <div class="d-flex justify-content-center">
                    <Button variant="outline-primary" as={Link} to="/Login" className="mt-3"  >
                        Wróć
            </Button>
                </div>
            </div>
        )
    }
}

export default RegisterForm