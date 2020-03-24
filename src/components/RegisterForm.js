import React, {Component } from 'react'
import { Form, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import APIHelper from '../API/APIHelper';

class RegisterForm extends Component {

    constructor() {
        super()
        this.state = {
            Email: "",
            UserName: "",
            Password: "",
            passwordRepeat: "",
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target
        this.setState({
            [name]: value
        })
        this.CanRegister();
    }

    handleSubmit(event) {
     
        this.Register(this.state.Email, this.state.UserName, this.state.Password )
        event.preventDefault();
      }

     CanRegister()
      {
          let output = false;
          if(this.state.Email && this.state.UserName && this.state.Password && this.state.passwordRepeat)
          {
              if(this.state.password === this.state.passwordRepeat)
              {
                output = true;
              }
              
          }
          //alert(output);
          return output;
      }

       Register(Email, UserName, Password) {
    
        let data;
        
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Email, UserName, Password })
            };
        
            return fetch('https://localhost:44342/api/Account/register', requestOptions)
            .then(handleResponse=>handleResponse.JSON())
            .then(handleResponse => { data = handleResponse.data
               
        
            
            });
        
        }
        



    render() {
        return (
            <div class="container">
                <div class="row">
                    <div class="col">
                        <Form onSubmit={this.handleSubmit}>
                            <h1 className="display-3 text-center mt-5">Rejestracja</h1>
                            <Form.Group controlId="formEmail">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" placeholder="Email" name="emEmailail"  onChange={this.handleChange} value={this.state.email}  />
                            </Form.Group>

                            <Form.Group controlId="formLogin">
                                <Form.Label>Login</Form.Label>
                                <Form.Control type="text" placeholder="Enter login" name="UserName"  onChange={this.handleChange} value={this.state.login}  />
                            </Form.Group>

                            <Form.Group controlId="formPassword">
                                <Form.Label>Hasło</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="Password"  onChange={this.handleChange} value={this.state.password} />
                            </Form.Group>

                            <Form.Group controlId="formPasswordRepeat">
                                <Form.Label>Powtórz hasło</Form.Label>
                                <Form.Control type="password" placeholder="Password" name="passwordRepeat"  onChange={this.handleChange} value={this.state.passwordRepeat}/>
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
}

export default RegisterForm