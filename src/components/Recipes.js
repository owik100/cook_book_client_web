import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Authentication } from "../helpers/Authentication"

class Recipes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            DuringOperation: false,
            UserOrPublic: "User",
            InfoMessage: "",
            Recipes: [],
            CanNext : false,
            CanPrevious: false,
            PageSize : 10,
            TotalPages : 1,
            PageNumberUserRecipes : 1,
            PageNumberPublicRecipes : 1,
        }

        this.PreviousPage = this.PreviousPage.bind(this);
        this.NextPage = this.NextPage.bind(this);
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
                 this.LoadPublicRecipes(this.state.PageSize, this.state.PageNumberPublicRecipes)
             }
             else {
                 this.setState({ UserOrPublic: "User" })
                 this.LoadUserRecipes(this.state.PageSize, this.state.PageNumberUserRecipes)
             }
 
         } catch (error) {
             this.setState({ UserOrPublic: "User" })
             this.LoadUserRecipes(this.state.PageSize, this.state.PageNumberUserRecipes)
         }
    }

    LoadUserRecipes(PageSize, PageNumber) {
        this.setState({ DuringOperation: true })

        let result = RecipesEndPointAPI.GetAllRecipesLoggedUser(PageSize, PageNumber)

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            this.AddDisplayAsPublicProperty(data)
            console.log(data)
            this.setState({ Recipes: data })
            this.setState({ DuringOperation: false })

            this.setState({TotalPages : data[0].totalPages})
            this.NavigationButtonsActiveDeactive(PageNumber)
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


    LoadPublicRecipes(PageSize, PageNumber) {
        this.setState({ DuringOperation: true })

        let result = RecipesEndPointAPI.GetPublicRecipes(PageSize, PageNumber)

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            this.AddDisplayAsPublicProperty(data)
            console.log(data)
            this.setState({ Recipes: data })
            this.setState({ DuringOperation: false })

            this.setState({TotalPages : data[0].totalPages})
            this.NavigationButtonsActiveDeactive(PageNumber)
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

    PreviousPage(){

        let actualPage = this.state.PageNumberUserRecipes;

      if(this.state.UserOrPublic === "User")
      {
        this.setState(prevstate => ({ PageNumberUserRecipes: prevstate.PageNumberUserRecipes - 1}));
          this.LoadUserRecipes(this.state.PageSize, actualPage - 1)
      }
      else{
        this.setState(prevstate => ({ PageNumberPublicRecipes: prevstate.PageNumberPublicRecipes - 1}));
          this.LoadUserRecipes(this.state.PageSize, actualPage - 1)
      }
    }

    NextPage()
    {

        let actualPage = this.state.PageNumberUserRecipes;

        if(this.state.UserOrPublic === "User")
        {
            this.setState(prevstate => ({ PageNumberUserRecipes: prevstate.PageNumberUserRecipes + 1}));
            this.LoadUserRecipes(this.state.PageSize, actualPage + 1)
        }
        else{
            this.setState(prevstate => ({ PageNumberPublicRecipes: prevstate.PageNumberPublicRecipes + 1}));
            this.LoadUserRecipes(this.state.PageSize, actualPage + 1)
        }
    }

    NavigationButtonsActiveDeactive(pageNumber)
    {
        if (pageNumber <= 1)
        {
            this.setState({CanPrevious : false});
        }
        else
        {
            this.setState({CanPrevious : true});
        }

        if (pageNumber >= this.state.TotalPages)
        {
            this.setState({CanNext : false});
        }
        else
        {
            this.setState({CanNext : true});
        }
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

                        <Button variant="primary" size="lg" disabled={!this.state.CanPrevious} onClick={this.PreviousPage}> &lt;= </Button>
            <p>Strona {this.state.UserOrPublic === "User" ? this.state.PageNumberUserRecipes : this.state.PageNumberPublicRecipes} z {this.state.TotalPages}</p>
            <Button variant="primary" size="lg" disabled={!this.state.CanNext} onClick={this.NextPage}> =&gt; </Button>

                    </Row>
                </Container>

            )
        }

    }

}

export default Recipes