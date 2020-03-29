import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col } from 'react-bootstrap';

class Recipes extends Component {

    constructor() {
        super()
        this.state = {
            DuringOperation: false,
            Recipes: [],
            RecipesImages: []
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

    DonwloadRecipeImage()
    {

        let iterator = 0;
let newRecipes = [];

        this.state.Recipes.forEach(function (item, key) {
            
           let result = RecipesEndPointAPI.DownloadImage(item.nameOfImage)
           result.then(data => {
            let outside = URL.createObjectURL(data)
            console.log(outside)
            item.image = outside;
           //this.setState({ Recipes[item].image : })
           newRecipes[iterator] = item;
           iterator++;
           this.setState({ RecipesImages: newRecipes })
         
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

        });

       
    }

    showImage() {

        let im = this.state.image

        return (
            <img src={im}></img>
        )
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

        const recipes = this.state.Recipes.map(item=>
        <Col key={item.recipeId}>
            <p>{item.name}</p>
            <img src={item.image}></img>
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