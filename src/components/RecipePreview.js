import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns, Button } from 'react-bootstrap';

class RecipePreview extends Component {

    constructor(props) {
        super(props)

        this.state = {
            Name: "",
            Instructions: "",
            Ingredients: [],
            Image: "",
            ID: ""
        }



        // if(localStorage.getItem('recipeName')!=null)
        // {
        //     this.state = {
        //         Name: localStorage.getItem('recipeName'),
        //         Instructions: localStorage.getItem('recipeInstructions'),
        //         Ingredients: localStorage.getItem('recipeIngredients'),
        //         Image: localStorage.getItem('recipeImage'),
        //     }
        // }
        // else{
        //     this.state = {
        //         Name: this.props.location.myCustomProps.item.name,
        //         Instructions: this.props.location.myCustomProps.item.instruction,
        //         Ingredients: this.props.location.myCustomProps.item.ingredients,
        //         Image: this.props.location.myCustomProps.item.image,
        //     }


        //     localStorage.setItem('recipeName', this.state.Name);
        //     localStorage.setItem('recipeInstructions', this.state.Instructions);
        //     localStorage.setItem('recipeIngredients', this.state.ingredients);
        //     localStorage.setItem('recipeImage', this.state.Image);







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
            this.setState({ Ingredients: localStorage.getItem('recipeIngredients') })
            this.setState({ Image: localStorage.getItem('recipeImage') })
        }

    }

    render() {
        const ingredients = this.state.Ingredients.map(item =>
            <li>
                {item}
            </li>
        )

        return (
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
                        <Button size="lg" variant="outline-danger" className="mt-3 mb-3  mx-auto d-block">Usuń</Button>
                        </Col>

                </Row>
            </Container>
        )
    }
}


export default RecipePreview