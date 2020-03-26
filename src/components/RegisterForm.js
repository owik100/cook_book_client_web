import React, {Component } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap';
import { Link } from "react-router-dom";
import {APIHelper} from '../API/APIHelper';

class RegisterForm extends Component {

    constructor() {
        super()
        this.state = {
            Email: "",
            Login: "",
            Password: "",
            ConfirmPassword: "",
            InfoMessage: "",
            DuringOperation: false
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
  
       
       this.Register(this.state.Email, this.state.Login, this.state.Password, this.state.ConfirmPassword)
//let info = APIHelper.Register(this.state.Email, this.state.Login, this.state.Password, this.state.ConfirmPassword);



        event.preventDefault();
      }


     Register(Email, UserName, Password, ConfirmPassword) {
    
this.setState({DuringOperation : true})

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
            return response.text() // or return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => {
            const error = await response.text().then(text => text)
            return Promise.reject(error)
        })
        .then(data => {
            console.log("Succes!")
            this.setState({InfoMessage:"Succes!" })
            this.setState({DuringOperation : false})
        })
        .catch(error => {
            //Connection problem
            if(error =="TypeError: response.text is not a function")
            {
                console.log('Connection problem')
                this.setState({InfoMessage:'Connection problem'})
                this.setState({DuringOperation : false})
            }
            else{
                console.log(error)
                this.setState({InfoMessage:error})
                this.setState({DuringOperation : false})
            }        
        })

};

     CanRegister()
      {
          let output = false;
          if(this.state.Email && this.state.Login && this.state.Password && this.state.ConfirmPassword)
          {
              if(this.state.Password === this.state.ConfirmPassword)
              {
                output = true;
              }
              
          }
          //alert(output);
          return output;
      }



      TestCall() { 
        //  fetch("https://swapi.co/api/people/1")
        // .then(response => response.json())
        // .then(data => console.log(data) )

        fetch("https://swapi.co/api/peoplew/1")
        .then(response => {
            if (response.ok) {
                return response.json()
            } else {
                return Promise.reject(response)
            }
        })
        .then(data => {
            console.log(data)
        })
        .catch(error => {
            console.log(error)
            if (error.status === 404) {
                console.log("Błąd: żądany adres nie istnieje");
            }
        });


    };



    render() {


     const isDuringOperation = this.state.DuringOperation;

        return (
            <div class="container">
                <div class="row">
                    <div class="col">

                    {isDuringOperation ?
                        <Spinner animation="border" role="status">
  <span className="sr-only">Loading...</span>
</Spinner>  :
                
                             <Form onSubmit={this.handleSubmit}>
                             <h1 className="display-3 text-center mt-5">Rejestracja</h1>
         {this.state.InfoMessage!="" ?  <h1 className="display-5 text-center ">{this.state.InfoMessage}</h1> : null }    
                             <Form.Group controlId="formEmail">
                                 <Form.Label>Email</Form.Label>
                                 <Form.Control type="email" placeholder="Email" name="Email"  onChange={this.handleChange} value={this.state.Email}  />
                             </Form.Group>
 
                             <Form.Group controlId="formLogin">
                                 <Form.Label>Login</Form.Label>
                                 <Form.Control type="text" placeholder="Enter login" name="Login"  onChange={this.handleChange} value={this.state.Login}  />
                             </Form.Group>
 
                             <Form.Group controlId="formPassword">
                                 <Form.Label>Hasło</Form.Label>
                                 <Form.Control type="password" placeholder="Password" name="Password"  onChange={this.handleChange} value={this.state.Password} />
                             </Form.Group>
 
                             <Form.Group controlId="formPasswordRepeat">
                                 <Form.Label>Powtórz hasło</Form.Label>
                                 <Form.Control type="password" placeholder="Password" name="ConfirmPassword"  onChange={this.handleChange} value={this.state.ConfirmPassword}/>
                             </Form.Group>
 
                             <Button variant="primary" type="submit">
                                 Zarejestruj
                         </Button>
                         </Form>
                    }
                   
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