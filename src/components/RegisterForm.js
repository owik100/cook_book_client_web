import React, { Component } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap';
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
        if(this.CanRegister())
        {
            this.Register(this.state.Email, this.state.Login, this.state.Password, this.state.ConfirmPassword)
            //let info = APIHelper.Register(this.state.Email, this.state.Login, this.state.Password, this.state.ConfirmPassword);
        }
        event.preventDefault();
    }


    Register(Email, UserName, Password, ConfirmPassword) {
        this.setState({ DuringOperation: true })

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Email, UserName, Password, ConfirmPassword })
        };

        fetch('https://localhost:44342/api/Account/register', requestOptions)
            .then(response => {
                // reject not ok response
                if (!response.ok) {
                    return Promise.reject(response)
                }
                return response.text() 
            })
            // catch error response and extract the error message
            .catch(async response => {
                const error = await response.text().then(text => text)
                return Promise.reject(error)
            })
            .then(data => {
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
                    var obj = JSON.parse(error)
                    console.log(obj.message)
                    this.setState({ InfoMessageIsError: true })
                    this.setState({ InfoMessage: obj.message })
                    this.setState({ DuringOperation: false })
                }
            })

    };

    CanRegister() {
        let output = false;
        if (this.state.Email && this.state.Login && this.state.Password && this.state.ConfirmPassword) {
            if (this.state.Password === this.state.ConfirmPassword) {
                output = true;
                this.setState({ InfoMessageIsError: false })
                this.setState({ InfoMessage: "" })
            }
            else{
                this.setState({ InfoMessageIsError: true })
                this.setState({ InfoMessage: "Hasła nie są takie same" })
            }
        }
        return output;
    }

    ClearForm()
    {
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
                    <Spinner animation="grow" variant="primary"  role="status">
                        <span className="sr-only my-auto mx-auto">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        else {
            if (this.state.InfoMessage != "" && this.state.InfoMessageIsError == false) {
                return (
                    <h2 className="display-5 text-center text-success ">{this.state.InfoMessage}</h2>
                );
            }
            else if (this.state.InfoMessage != "" && this.state.InfoMessageIsError == true) {
                return (
                    <h2 className="display-5 text-center text-danger ">{this.state.InfoMessage}</h2>
                );
            }
            else {
                return null
            }
        }
    }

    render() {
        const isDuringOperation = this.state.DuringOperation;
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
                <Button variant="outline-primary" as={Link} to="/LoginForm" className="mt-3"  >
                    Wróć
            </Button>
            </div>
            </div>
        )
    }
}

export default RegisterForm