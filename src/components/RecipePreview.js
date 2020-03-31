import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns, Button, Modal } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";

class RecipePreview extends Component {

    constructor(props) {
        super(props)

        this.state = {
            Name: "",
            Instructions: "",
            Ingredients: [],
            Image: "",
            ID: "",
            showModal: false,
            RecipeDeleted: false
        }
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleRecipeDelete = this.handleRecipeDelete.bind(this);

    }

    componentDidMount() {

        try {
            this.setState({ Name: this.props.location.myCustomProps.item.name })
            this.setState({ Instructions: this.props.location.myCustomProps.item.instruction })
            this.setState({ Ingredients: this.props.location.myCustomProps.item.ingredients })
            this.setState({ Image: this.props.location.myCustomProps.item.image })
            this.setState({ ID: this.props.location.myCustomProps.item.recipeId })

            localStorage.setItem('recipeName', this.props.location.myCustomProps.item.name);
            localStorage.setItem('recipeInstructions', this.props.location.myCustomProps.item.instruction);
            localStorage.setItem('recipeIngredients', this.props.location.myCustomProps.item.ingredients);
            localStorage.setItem('recipeImage', this.props.location.myCustomProps.item.image);

            localStorage.setItem('all', this.props.location.myCustomProps.item);

        } catch (error) {

            let a1 = localStorage.getItem('recipeName')
            let a2 = localStorage.getItem('recipeInstructions')
            let a3 = localStorage.getItem('recipeIngredients')
            let a4 = localStorage.getItem('recipeImage')

            this.setState({ Name: localStorage.getItem('recipeName') })
            this.setState({ Instructions: localStorage.getItem('recipeInstructions') })
            this.setState({ Ingredients: ['1'] })
            this.setState({ Image: localStorage.getItem('recipeImage') })
        }

    }

    handleModalShow(event) {
        this.setState({ showModal: true })

    }

    handleModalClose(event) {
        this.setState({ showModal: false })

    }

    ModalDelete(props) {
        return (
            <Modal
                {...props}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        {props.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Na pewno chcesz usunąć ten przepis? Operacji nie można cofnąć!
              </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={props.delete}>Usuń</Button>
                    <Button variant="dark" onClick={props.onHide}>Cofnij</Button>
                </Modal.Footer>
            </Modal>
        );
    }

    handleRecipeDelete(event) {
        let result = RecipesEndPointAPI.DeleteRecipes(this.state.ID)

        result.then(data => {
            console.log("Usunięto!")
            this.setState({ RecipeDeleted: true })
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
                }
                else {
                    try {
                        var obj = JSON.parse(error)
                        console.log(obj.message)
                    }
                    //Another problem...
                    catch (error) {
                        console.log(error);
                    }
                }
            })
    }


    render() {

        if (this.state.RecipeDeleted === true) {
            return <Redirect to='/Recipes' />
        }

        const ingredients = this.state.Ingredients.map(item =>
            <li>
                {item}
            </li>
        )

        return (
            <div>
                <Container>
                    <Row>
                        <Col md={12}>
                            <h1 className="mt-3 mb-3 text-center">{this.state.Name}</h1>
                        </Col>

                        <Col md={12}>
                            <p className="ml-2 mr-2" >{this.state.Instructions}</p>
                        </Col>

                        <Col md={4} className="align-self-center">
                            <ul>
                                {ingredients}
                            </ul>
                        </Col>

                        <Col md={8}>
                            <img className="img-fluid mx-auto d-block" src={this.state.Image}></img>
                        </Col>


                        <Col  >
                            <Button size="lg" variant="outline-dark" className="mr-3 mt-3 mb-3 mx-auto d-block" >Edytuj</Button>
                        </Col>
                        <Col  >
                            <Button onClick={this.handleModalShow} size="lg" variant="outline-danger" className="mt-3 mb-3  mx-auto d-block">Usuń</Button>
                        </Col>

                    </Row>
                </Container>

                <this.ModalDelete
                    show={this.state.showModal}
                    onHide={this.handleModalClose}
                    name={this.state.Name}
                    delete={this.handleRecipeDelete}
                />

            </div>
        )
    }
}


export default RecipePreview