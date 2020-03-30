import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col } from 'react-bootstrap';

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
                <Col key={item.recipeId}>
                    <p>{item.name}</p>
                    <img className="img-fluid" src={item.image}></img>
                </Col>)

            return (
                <Container>
                    <Row>
                        {recipes}
                    </Row>
                </Container>
            )
        }

    }


}

export default Recipes