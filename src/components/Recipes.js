import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns } from 'react-bootstrap';
import { Link} from "react-router-dom";

class Recipes extends Component {

    constructor() {
        super()
        this.state = {
            DuringOperation: false,
            Recipes: []
        }
        //this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        this.setState({ DuringOperation: true })
        let result = RecipesEndPointAPI.GetAllRecipesLoggedUser()

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            console.log(data)
            this.setState({ Recipes: data })
            this.setState({ DuringOperation: false })
            this.DonwloadRecipeImage();
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
                        this.setState({ DuringOperation: false })
                    }
                    //Another problem...
                    catch (error) {
                        console.log(error);
                        this.setState({ DuringOperation: false })
                    }
                }
            })
    }

    DonwloadRecipeImage() {
        let that = this
        let outside
        this.setState({ DuringOperation: true })

        this.state.Recipes.forEach(function (item, key) {

            if (item.nameOfImage === null) {
                item.image = '/food template.png'
                that.setState({
                    Recipes: that.state.Recipes.map(el => (el.recipeId === item.recipeId ? { ...el, item } : el))
                });
            }
            else {
                let result = RecipesEndPointAPI.DownloadImage(item.nameOfImage)
                result.then(data => {
                    outside = URL.createObjectURL(data)
                    item.image = outside
                    console.log(outside)
                    that.setState({
                        Recipes: that.state.Recipes.map(el => (el.recipeId === item.recipeId ? { ...el, item } : el))
                    });
                    that.setState({ DuringOperation: false })

                })
                    .catch(error => {
                        //Connection problem
                        if (error == "TypeError: response.text is not a function") {
                            console.log('Problem z połączeniem')
                            that.setState({ DuringOperation: false })
                        }
                        else {
                            try {
                                var obj = JSON.parse(error)
                                console.log(obj.message)
                                that.setState({ DuringOperation: false })
                            }
                            //Another problem...
                            catch (error) {
                                console.log(error);
                                that.setState({ DuringOperation: false })
                            }
                        }
                    })
            }
        });
    }

    render() {
        if (this.state.DuringOperation) {
            return (

                <div class="d-flex justify-content-center Center">
                    <Spinner animation="grow" variant="primary" role="status">
                        <span className="sr-only my-auto mx-auto">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        else {

const recipes = this.state.Recipes.map(item =>
    
    <Col sm={4} md={3} lg={2} xl={2}   as={Link} to={
        { 
            pathname: `/RecipePreview/${item.recipeId}`,
            myCustomProps: item
        }} className="SingleRecipe" key={item.recipeId}>


            <div className="mt-3 singleRecipe" >
            <div class="d-flex justify-content-center">
            <img  src={item.image} /> 
            </div>
            <p className="text-center"> {item.name}</p>
            </div>
    </Col>)
            return (
               <Container fluid>
                   <Row>
                   {recipes}
                   </Row>
               </Container>

            )
        }

    }


}

export default Recipes