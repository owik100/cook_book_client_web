import React, { Component } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Authentication } from "../helpers/Authentication"

class LoginForm extends Component {

    constructor()
    {
        super()
        this.state = {
            Login: "",
            Password: "",
            RememberMe: false,
            InfoMessage: "",
            DuringOperation: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        const token = Authentication.LoadToken();
        console.log(token)
     }

    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleSubmit(event) {      
        this.LogIn(this.state.Login, this.state.Password)       
        event.preventDefault();
    }

    LogIn(username, password) {
        this.setState({ DuringOperation: true })

        let body =  new URLSearchParams();
        body.append("grant_type", "password");
        body.append("username", username);
        body.append("password", password);

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: body
        };

        fetch('https://localhost:44342/token', requestOptions)
            .then(response => {
                // reject not ok response
                if (!response.ok) {
                    return Promise.reject(response)
                }
                return response.json() 
            })
            // catch error response and extract the error message
            .catch(async response => {
                const error = await response.text().then(text => text)
                return Promise.reject(error)
            })
            .then(data => {
                console.log("Zalogowano")
                this.setState({ InfoMessage: ""})
                this.setState({ DuringOperation: false })
                
                Authentication.SaveToken(data.access_Token, this.state.RememberMe )
              
                //Load home page...
            })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
                    this.setState({ InfoMessage: 'Problem z połączeniem' })
                    this.setState({ DuringOperation: false })
                }
                else {
                    try{
                        var obj = JSON.parse(error)
                        console.log(obj.message)
                        this.setState({ InfoMessage: obj.message })
                        this.setState({ DuringOperation: false })
                    }
                    //Another problem...
                    catch(error){
                        console.log(error);
                    }
                   
                }
            })

    };


    LoginMessage() {
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
            if (this.state.InfoMessage != "") {
                return (
                    <h2 className="display-5 text-center text-danger ">{this.state.InfoMessage}</h2>
                );
            }
            else {
                return null
            }
        }
    }



render()
{
    return (
        <div class="container">
            <div class="row">
                <div class="col">
                    <Form onSubmit={this.handleSubmit}>
                        <h1 className="display-3 text-center mt-5">Logowanie</h1>

                        {this.LoginMessage()}

                        <Form.Group controlId="formLogin">
                            <Form.Label>Login</Form.Label>
                            <Form.Control type="text" required placeholder="Enter login"  name="Login" onChange={this.handleChange} value={this.state.Login} />
                        </Form.Group>

                        <Form.Group controlId="formPassword">
                            <Form.Label>Hasło</Form.Label>
                            <Form.Control type="password" required placeholder="Password"  name="Password" onChange={this.handleChange} value={this.state.Password} />
                        </Form.Group>

                        <Form.Group controlId="formRemember">
                            <Form.Check type="checkbox" label="Zapamiętaj" name="RememberMe" onChange={this.handleChange} value={this.state.RememberMe} />
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
                <Button variant="outline-primary" as={Link} to="/RegisterForm"  >
                    Zarejestruj
            </Button>
            </div>
        </div>
    )
}

   
}

export default LoginForm