import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, Alert } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Authentication } from "../helpers/Authentication"

class Recipes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            DuringOperation: false,
            UserOrPublic: "User",
            InfoMessage: "",
            Recipes: []
        }
    }


    componentWillReceiveProps(nextProps) {
       this.CheckPath()
    }
    



    componentDidMount() {
        this.CheckPath()
    }


    AddDisplayAsPublicProperty(data)
    {
        data.forEach(function (element) {
            element.DisplayAsPublic = true;
            if(element.isPublic && element.userName === Authentication.LoadUserName())
            {
                element.DisplayAsPublic = true;
            }
            else{
                element.DisplayAsPublic = false;
            }   
          });
    }

    CheckPath()
    {
        try {
            let pathName = window.location.pathname;
            console.log(pathName);
 
             if (pathName === "/PublicRecipes") {
                 this.setState({ UserOrPublic: "Public" })
                 this.LoadPublicRecipes()
             }
             else {
                 this.setState({ UserOrPublic: "User" })
                 this.LoadUserRecipes()
             }
 
         } catch (error) {
             this.setState({ UserOrPublic: "User" })
             this.LoadUserRecipes()
         }
    }

    LoadUserRecipes() {
        this.setState({ DuringOperation: true })
        let result = RecipesEndPointAPI.GetAllRecipesLoggedUser()

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            this.AddDisplayAsPublicProperty(data)
            console.log(data)
            this.setState({ Recipes: data })
            this.setState({ DuringOperation: false })
            this.DonwloadRecipeImage();
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    this.setState({ InfoMessage: "Problem z połączeniem" })
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
                        this.setState({ DuringOperation: false })
                    }
                }
            })
    }


    LoadPublicRecipes() {
        this.setState({ DuringOperation: true })
        let result = RecipesEndPointAPI.GetPublicRecipes()

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            this.AddDisplayAsPublicProperty(data)
            console.log(data)
            this.setState({ Recipes: data })
            this.setState({ DuringOperation: false })
            this.DonwloadRecipeImage();
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    this.setState({ InfoMessage: "Problem z połączeniem" })
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
        } else if (this.state.InfoMessage != "") {
            return (
                <Alert className="text-center" variant="danger">
                    {this.state.InfoMessage}
                </Alert>
            )
        }
        else {

            const recipes = this.state.Recipes.map(item =>

                <Col sm={4} md={3} lg={2} xl={2} as={Link} to={
                    {
                        pathname: `/RecipePreview/${item.recipeId}`,
                        myCustomProps: item,
                        myCustomProps2: this.state.UserOrPublic
                    }} className={item.DisplayAsPublic ? 'PublicRecipe' : null} key={item.recipeId}>


                    <div className="mt-3 singleRecipe" >
                        <div class="d-flex justify-content-center">
                            <img src={item.image} />
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