import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Authentication } from "../helpers/Authentication"
import { APIHelper } from '../API/APIHelper';

class Recipes extends Component {

    constructor(props) {
        super(props)
        this.state = {
            DuringOperation: false,
            UserOrPublicOrFavourites: "User",
            InfoMessage: "",
            Recipes: [],
            CanNext : false,
            CanPrevious: false,
            PageSize : 10,
            TotalPages : 1,
            PageNumberUserRecipes : 1,
            PageNumberPublicRecipes : 1,
            PageNumberFavouritesRecipes : 1,
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
        let pathName = window.location.pathname;

        data.forEach(function (element) {
            element.DisplayAsPublic = false;
            if(element.isPublic && element.userName === Authentication.LoadUserName() && (pathName === "/PublicRecipes" || pathName === "/UserRecipes" || pathName === "/"))
            {
                element.DisplayAsPublic = true;
            }
            else{
                element.DisplayAsPublic = false;
            }   
          });
    }

    AddDisplayAsFavouritesProperty(data)
    {
        let pathName = window.location.pathname;
        let favourites = Authentication.LoadUserFavouritesRecipes()

        data.forEach(function (element) {
            element.DisplayAsFavourite = false;
            if(pathName === "/PublicRecipes" && favourites.includes(element.recipeId))
            {
                element.DisplayAsFavourite = true;
            }
            else{
                element.DisplayAsFavourites = false;
            }   
          });
    }

    CheckPath()
    {
        try {
            let pathName = window.location.pathname;
           
            console.log(pathName);

        let pageNumberUser = this.props.location.pageBackUser
        let pageNumberPublic = this.props.location.pageBackPublic
        let pageNumberFavourites = this.props.location.pageBackFavourites

        if(pageNumberUser != undefined)
        this.setState({ PageNumberUserRecipes: pageNumberUser})

        if(pageNumberPublic != undefined)
        this.setState({ PageNumberPublicRecipes: pageNumberPublic})

        if(pageNumberFavourites != undefined)
        this.setState({ PageNumberFavouritesRecipes: pageNumberFavourites})

             if (pathName === "/PublicRecipes") {
                let pageNumber = this.props.location.pageBackPublic
                if(pageNumber === undefined)
                pageNumber = this.state.PageNumberPublicRecipes

                 this.setState({ PageNumberPublicRecipes: pageNumber})
                 this.setState({ UserOrPublicOrFavourites: "Public" })
                 this.LoadPublicRecipes(this.state.PageSize, pageNumber)
             }
             else if(pathName === "/UserRecipes") {
                let pageNumber = this.props.location.pageBackUser
                if(pageNumber === undefined)
                pageNumber = this.state.PageNumberUserRecipes

                this.setState({ PageNumberUserRecipes: pageNumber})
                 this.setState({ UserOrPublicOrFavourites: "User" })
                 this.LoadUserRecipes(this.state.PageSize, pageNumber)
             }
             else if(pathName === "/FavouritesRecipes") {
                let pageNumber = this.props.location.pageBackFavourites
                if(pageNumber === undefined)
                pageNumber = this.state.PageNumberFavouritesRecipes

                this.setState({ PageNumberFavouritesRecipes: pageNumber})
                 this.setState({ UserOrPublicOrFavourites: "Favourites" })
                 this.LoadFavouritesRecipes(this.state.PageSize, pageNumber)
             }
             else{
                this.setState({ UserOrPublicOrFavourites: "User" })
                this.LoadUserRecipes(this.state.PageSize, this.state.PageNumberUserRecipes)
             }
 
 
         } catch (error) {
             this.setState({ UserOrPublicOrFavourites: "User" })
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

        this.LoadUserData();

        let result = RecipesEndPointAPI.GetPublicRecipes(PageSize, PageNumber)

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            this.AddDisplayAsPublicProperty(data)
            this.AddDisplayAsFavouritesProperty(data)
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

    LoadFavouritesRecipes(PageSize, PageNumber) {
        this.setState({ DuringOperation: true })

        let result = RecipesEndPointAPI.GetFavouritesRecipes(PageSize, PageNumber)

        result.then(data => {
            console.log("Pobrano dane użytkownika")
           
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

    //Get user favourites recipes - All. 
    LoadUserData()
    {
        let result = APIHelper.GetUserData()

        result.then(data => {
            console.log("Pobrano dane użytkownika")
            console.log(data)
            Authentication.SaveUserData(data);
            this.setState({ isLogged: true })
        })
            .catch(error => {
                //Connection problem
                if (error == "TypeError: response.text is not a function") {
                    console.log('Problem z połączeniem')
                    this.setState({ InfoMessage: 'Problem z połączeniem' })
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

    DonwloadRecipeImage() {
        let that = this
        let outside
        //this.setState({ DuringOperation: true })

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
      if(this.state.UserOrPublicOrFavourites === "User")
      {

        let actualPage = this.state.PageNumberUserRecipes;

        this.setState(prevstate => ({ PageNumberUserRecipes: prevstate.PageNumberUserRecipes - 1}));
          this.LoadUserRecipes(this.state.PageSize, actualPage - 1)
      }
      else{

        let actualPage = this.state.PageNumberPublicRecipes;

        this.setState(prevstate => ({ PageNumberPublicRecipes: prevstate.PageNumberPublicRecipes - 1}));
          this.LoadPublicRecipes(this.state.PageSize, actualPage - 1)
      }
    }

    NextPage()
    {
        if(this.state.UserOrPublicOrFavourites === "User")
        {

            let actualPage = this.state.PageNumberUserRecipes;

            this.setState(prevstate => ({ PageNumberUserRecipes: prevstate.PageNumberUserRecipes + 1}));
            this.LoadUserRecipes(this.state.PageSize, actualPage + 1)
        }
        else{


            let actualPage = this.state.PageNumberPublicRecipes;

            this.setState(prevstate => ({ PageNumberPublicRecipes: prevstate.PageNumberPublicRecipes + 1}));
            this.LoadPublicRecipes(this.state.PageSize, actualPage + 1)
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
                <Alert className="text-center mt-3" variant="danger">
                    {this.state.InfoMessage}
                </Alert>
            )
        }
        else {

            const recipes = this.state.Recipes.map(item =>{
                return(
                    <Col sm={4} md={3} lg={2} xl={2} as={Link} to={
                        {
                            pathname: `/RecipePreview/${item.recipeId}`,
                            myCustomProps: item,
                            myCustomProps2: this.state.UserOrPublicOrFavourites,
                            pageBackUser: this.state.PageNumberUserRecipes,
                            pageBackPublic: this.state.PageNumberPublicRecipes,
                            pageBackFavourites: this.state.PageNumberFavouritesRecipes
                        }} 
                         className={ item.DisplayAsPublic ? 'PublicRecipe' : item.DisplayAsFavourite ? 'FavouriteRecipe' : null} key={item.recipeId}>
    
                        <div className="mt-3 singleRecipe" >
                            <div class="d-flex justify-content-center">
                                <img src={item.image} />
                            </div>
                            <p className="text-center"> {item.name}</p>
                        </div>
                    </Col>
                )
           })
                
            return (
                <Container fluid>
                    <Row>
                        {recipes}

                        <Col md={12}>
                        <div className="d-flex justify-content-center mt-3">
                        <Button className="mr-3" variant="primary" size="lg" disabled={!this.state.CanPrevious} onClick={this.PreviousPage}> &lt;= </Button>
                        <p className="mr-3 ">
                        {(() => {
                            switch (this.state.UserOrPublicOrFavourites) {
                            case "User":   return "Strona " + this.state.PageNumberUserRecipes + " z " + this.state.TotalPages;
                            case "Public": return "Strona " + this.state.PageNumberPublicRecipes + " z " + this.state.TotalPages;
                            case "Favourites":  return "Strona " + this.state.PageNumberFavouritesRecipes + " z " + this.state.TotalPages;
                            default:      return "Strona " + this.state.PageNumberUserRecipes + " z " + this.state.TotalPages;
                            }
                        })()}
                        </p>
            <Button variant="primary" size="lg" disabled={!this.state.CanNext} onClick={this.NextPage}> =&gt; </Button>

                        </div>
                       
                        </Col>

                
                    </Row>
                </Container>

            )
        }

    }

}

export default Recipes