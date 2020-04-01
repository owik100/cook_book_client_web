import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns, Button, Modal, Form, } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import bsCustomFileInput from 'bs-custom-file-input'

class AddOrEdit extends Component {

    constructor() {
        super()
      
        this.state = {
            InfoMessage: "",
            DuringOperation: false,
            CanSubmit: false,
            RecipeName: "",
            Instructions: "",
            Ingredients: [],
            Image: null,
            ID: "",
            OperationComplete: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeFile =this.onChangeFile.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init()
      }

    
    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    onChangeFile(e)
    {
        this.setState({Image:e.target.files[0]})
        this.setState({ImageName:e.target.files[0].name})
    }

    handleSubmit(event) {
        if (this.CanSubmit()) {
            this.setState({ DuringOperation: true })

           let result = RecipesEndPointAPI.InsertRecipe(this.state.RecipeName,this.state.Instructions,this.state.Ingredients,this.state.Image, this.state.ImageName )
            result.then(data => {
                console.log("Przepis dodany")
                this.setState({ DuringOperation: false })
                this.setState({ OperationComplete: true })
            })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
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
        event.preventDefault();
    }


    CanSubmit() {
        let output = false;
        if (this.state.RecipeName && this.state.Instructions && this.state.Ingredients && !this.state.DuringOperation) {  
                output = true;
            }
        return output;
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


        if (this.state.OperationComplete === true) {
            return <Redirect to='/Recipes' />
        }

        return (
            
            <div class="container">
                <div class="row">
                    <div class="col">

                        <Form id="registerForm" onSubmit={this.handleSubmit}>

                            {this.RegisterMessage()}

                            <Form.Group controlId="formName">
                                <Form.Label>Nazwa przepisu</Form.Label>
                                <Form.Control type="text" placeholder="name" name="RecipeName" required onChange={this.handleChange} value={this.state.RecipeName} />
                            </Form.Group>

                            <Form.Group controlId="formInstructions">
                                <Form.Label>Przepis:</Form.Label>
                                <Form.Control type="text" placeholder="Przepis" name="Instructions" required onChange={this.handleChange} value={this.state.Instructions} />
                            </Form.Group>

                            <Form.Group controlId="formIngredients">
                                <Form.Label>Składniki</Form.Label>
                                <Form.Control type="text" placeholder="Składniki" name="Ingredients" required onChange={this.handleChange} value={this.state.Ingredients} />
                            </Form.Group>

                            <div class="custom-file">
                                <input id="formFile" type="file" class="custom-file-input" accept="image/*" onChange={this.onChangeFile} />
                                <label class="custom-file-label" for="inputGroupFile01">Wybierz obrazek</label>
                            </div>

                            <div class="d-flex justify-content-center">
                                <Button variant="primary" type="submit">
                                    Dodaj
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


export default AddOrEdit