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
        const that = this;
        let oldRecipies = this.state.Recipes
        let urlsArray = []
        var promises = [];

        for (var i = 0; i < this.state.Recipes.length; i++)
        {
            urlsArray.push(this.state.Recipes[i].nameOfImage)
        }


       
        Promise.all(

            [
                RecipesEndPointAPI.DownloadImage(urlsArray[0]),
                RecipesEndPointAPI.DownloadImage(urlsArray[1])
            ]
        )
            .then(function (data) {
                // Log the data to the console
                // You would do something with both sets of data here
                 console.log(data);
                 let outside = URL.createObjectURL(data[0])
                 let outside1 = URL.createObjectURL(data[1])
                let images =[]
                images.push(outside)
                images.push(outside1)

                
                oldRecipies[0].image=outside
                oldRecipies[1].image=outside1

                that.setState({ DuringOperation: false })
                that.setState({ Recipes: oldRecipies })

            }).catch(function (error) {
                // if there's an error, log it
                console.log(error);
            });
        

    }



    

    Download(name)
    {
         let result = RecipesEndPointAPI.DownloadImage(name)
           result.then(data => {
            let outside = URL.createObjectURL(data)
            console.log(outside)
           return result;
           //this.setState({ Recipes[item].image : })
         
         
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