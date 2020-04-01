import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns, Button, Modal, Form, ListGroup } from 'react-bootstrap';
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
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleIngredientAdd = this.handleIngredientAdd.bind(this);
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

    handleIngredientAdd(e)
    {

    }

    onChangeFile(e) {
        this.setState({ Image: e.target.files[0] })
        this.setState({ ImageName: e.target.files[0].name })
    }

    handleSubmit(event) {
        if (this.CanSubmit()) {
            this.setState({ DuringOperation: true })

            let result = RecipesEndPointAPI.InsertRecipe(this.state.RecipeName, this.state.Instructions, this.state.Ingredients, this.state.Image, this.state.ImageName)
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

            <Form id="registerForm" onSubmit={this.handleSubmit}>

                <Container>
                    <Row>


                        <Col md={12}>
                            {this.RegisterMessage()}

                            <Form.Group controlId="formName">
                                {/* <Form.Label   className="text-center" style={{width: "100%"}}>Nazwa przepisu:</Form.Label> */}
                                <h3 className="text-center">Nazwa przepisu:</h3>
                                <Form.Control type="text" size="lg" name="RecipeName" required onChange={this.handleChange} value={this.state.RecipeName} />
                            </Form.Group>
                        </Col>


                        <Col md={8}>

                            <Form.Group controlId="formInstructions">
                                {/* <Form.Label className="text-center" style={{width: "100%"}} >Przepis:</Form.Label> */}
                                <h3 className="text-center">Przepis:</h3>
                                <Form.Control as="textarea" style={{ height: "400px" }} size="lg" type="text" name="Instructions" required onChange={this.handleChange} value={this.state.Instructions} />
                            </Form.Group>
                        </Col>

                        <Col md={4}>
                            <Form.Group controlId="formIngredients">
                                {/* <Form.Label>Składniki</Form.Label> */}
                                <h3 className="text-center">Składniki:</h3>
                                <Form.Control type="text" name="Ingredients" required onChange={this.handleChange} value={this.state.Ingredients} />
                            </Form.Group>

                            <div class="d-flex justify-content-center mb-3">
                            <Button onClick={this.handleIngredientAdd} className="mr-3">Dodaj</Button>
                            <Button>Usuń</Button>
                            </div>
                            <ListGroup id="IngredientsGroup">

                            </ListGroup>
                        </Col>



                        <Col md={12}>
                            <h3 className="text-center">Obrazek:</h3>
                            <div class="custom-file mb-3">
                                <input id="formFile" type="file" class="custom-file-input" accept="image/*" onChange={this.onChangeFile} />
                                <label class="custom-file-label" for="inputGroupFile01">Wybierz obrazek</label>
                            </div>

                            <div class="d-flex justify-content-center">
                                <Button variant="primary" type="submit" size="lg">
                                    Dodaj
    </Button>
                            </div>


                            <div class="d-flex justify-content-center mb-3">
                    <Button variant="outline-primary" as={Link} to="/Login" className="mt-3"  >
                         Wróć
             </Button>
                 </div>
      

                        </Col>








                        <Col>

                        </Col>
                    </Row>
                </Container>

            </Form>

            // <div class="container">
            //     <div class="row">
            //         <div class="col">


            //         </div>
            //     </div>
            //     <div class="d-flex justify-content-center mb-3">
            //         <Button variant="outline-primary" as={Link} to="/Login" className="mt-3"  >
            //             Wróć
            // </Button>
            //     </div>
            // </div>

        )
    }
}


export default AddOrEdit