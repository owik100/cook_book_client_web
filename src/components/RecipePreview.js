import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, Alert, Button, Modal } from 'react-bootstrap';
import { Authentication } from "../helpers/Authentication"
import { APIHelper } from '../API/APIHelper';
import { Link, Redirect } from "react-router-dom";
export * from 'react-router';

class RecipePreview extends Component {

    constructor(props) {
        super(props)

        this.state = {
            Name: "",
            Instructions: "",
            Ingredients: [],
            Image: "",
            nameOfImage: "",
            ID: "",
            isPublic: false,
            userName: "",
            showModal: false,
            RecipeDeleted: false,
            DuringOperation: false,
            InfoMessage: "",
            LastVisit : "",
            PageBack: "1",
            IsFavourite: false,
        }
        this.handleModalClose = this.handleModalClose.bind(this);
        this.handleModalShow = this.handleModalShow.bind(this);
        this.handleRecipeDelete = this.handleRecipeDelete.bind(this);
        this.handleFavouriteCLick = this.handleFavouriteCLick.bind(this);

    }

    componentDidMount() {

        //Pobierz przepis z przeslanych propsow. Gdy strona odswiezana/ nie ma propsow, pobierz z API
        console.log(this.props.match.params.id)
        try {
            this.setState({ Name: this.props.location.myCustomProps.item.name })
            this.setState({ Instructions: this.props.location.myCustomProps.item.instruction })
            this.setState({ Ingredients: this.props.location.myCustomProps.item.ingredients })
            this.setState({ Image: this.props.location.myCustomProps.item.image })
            this.setState({ ID: this.props.location.myCustomProps.item.recipeId })
            this.setState({ nameOfImage: this.props.location.myCustomProps.item.nameOfImage })
            this.setState({ isPublic: this.props.location.myCustomProps.item.isPublic })
            this.setState({ userName: this.props.location.myCustomProps.item.userName })
            this.setState({ PageBackUser: (this.props.location.pageBackUser)})
            this.setState({ PageBackPublic: (this.props.location.pageBackPublic)})
            this.setState({ PageBackFavourites: (this.props.location.pageBackFavourites)})

            let favourites = Authentication.LoadUserFavouritesRecipes()

            if(favourites.includes(this.props.location.myCustomProps.item.recipeId )){
                this.setState({ IsFavourite: (true)})
            }

if(this.props.location.myCustomProps2 === "User")
{
    this.setState({ LastVisit: "/UserRecipes"})
}
else if (this.props.location.myCustomProps2 === "Public")
{
    this.setState({ LastVisit: "/PublicRecipes"})
}
else{
    this.setState({ LastVisit: "/FavouritesRecipes"})
}


            


        } catch (error) {
            this.setState({ DuringOperation: true })

            let result = RecipesEndPointAPI.GetRecipeByID(this.props.match.params.id)
            result.then(data => {
                console.log("Pobrano przepis ")
                console.log(data)
                this.setState({ Name: data.name })
                this.setState({ Instructions: data.instruction })
                this.setState({ Ingredients: data.ingredients })
                this.setState({ nameOfImage: data.nameOfImage })
                this.setState({ ID: data.recipeId })
                this.setState({ isPublic: data.isPublic })
                this.setState({ userName: data.userName })

                this.setState({ LastVisit: "/UserRecipes"})

                let favourites = Authentication.LoadUserFavouritesRecipes()

                if(favourites.includes(data.recipeId )){
                    this.setState({ IsFavourite: (true)})
                }


                this.setState({ DuringOperation: false })
                this.DonwloadRecipeImage();
            })
                .catch(error => {
                    //Connection problem
                    if (error == "TypeError: response.text is not a function") {
                        console.log('Problem z połączeniem')
                        this.setState({ InfoMessage: "Problem z połączeniem"})
                        this.setState({ DuringOperation: false })
                    }
                    else {
                        try {
                            var obj = JSON.parse(error)
                            console.log(obj.message)
                            this.setState({ InfoMessage: obj.message})
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
    }

    DonwloadRecipeImage() {
        let that = this
        let outside

        if (this.state.nameOfImage === null) {
            this.setState({ Image: '/food template.png' })
        }
        else {

            this.setState({ DuringOperation: true })
            let result = RecipesEndPointAPI.DownloadImage(this.state.nameOfImage)
            result.then(data => {
                console.log("Pobrano obrazek")
                console.log(data)
                outside = URL.createObjectURL(data)
                this.setState({ Image: outside })
                console.log(outside)
                this.setState({ DuringOperation: false })
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
    }


    handleModalShow(event) {
        this.setState({ showModal: true })

    }

    handleModalClose(event) {
        this.setState({ showModal: false })

    }

    handleFavouriteCLick(event) {

        let localBoolFavourites = false;
        let favourites = Authentication.LoadUserFavouritesRecipes()
        let favourtesArr = JSON.parse(favourites);

        if(this.state.IsFavourite){     
            localBoolFavourites = true;

            const index = favourtesArr.indexOf(this.state.ID);
            if (index > -1) {
                favourtesArr.splice(index, 1);
            }
        }
        else{
            localBoolFavourites = false;

            favourtesArr.push(this.state.ID) 
        }
            
            let result =  APIHelper.EditUser(favourtesArr)

            result.then(data => {
                if(localBoolFavourites){
                    console.log("Usunięto z ulubionych!")
                    this.setState({ IsFavourite: (false)})
                }
                else{
                    console.log("Dodano do ulubionych!")
                    this.setState({ IsFavourite: (true)})
                }

                Authentication.SaveFavouritesRecipes(favourtesArr)
               
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

        let editButton;
        let deleteButton;
        let authorInfo;
        let favouriteButton;

        if (!this.state.isPublic || this.state.userName === Authentication.LoadUserName()) 
        {      editButton =  <Button size="lg" variant="outline-dark" className="mr-3 mt-3 mb-3 mx-auto d-block" as={Link} to={
            {
                pathname: `/Edit/${this.state.ID}`,
                myCustomProps: this.state
            }}  >Edytuj</Button> 
        
            deleteButton =  <Button onClick={this.handleModalShow} size="lg" variant="outline-danger" className="mt-3 mb-3  mx-auto d-block">Usuń</Button>
        
            authorInfo = null;
            favouriteButton = null;
        } 

        else 
        {   editButton = null
            deleteButton = null

        authorInfo = <p  className="text-center">Autor przepisu: {this.state.userName}</p>

        favouriteButton =  <Button onClick={this.handleFavouriteCLick} size="lg" variant="outline-warning" className="mt-3 mb-3  mx-auto d-block"> <img className="img-fluid imgStar" 
         src= {this.state.IsFavourite ? '/starFull.png' : '/starEmpty.png'} /> </Button>

         }

        const ingredients = this.state.Ingredients.map(item =>
            <li>
                {item}
            </li>)

        if (this.state.DuringOperation) {
            return (

                <div class="d-flex justify-content-center Center">
                    <Spinner animation="grow" variant="primary" role="status">
                        <span className="sr-only my-auto mx-auto">Loading...</span>
                    </Spinner>
                </div>
            )
        } else if(this.state.InfoMessage != "")
        {
            return (
            <Alert className="text-center mt-3"  variant="danger">
            {this.state.InfoMessage}
          </Alert>
          )
        }
        else {
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
                                <Button size="lg" variant="outline-dark" className="mr-3 mt-3 mb-3 mx-auto d-block" as={Link} to={
                    {
                        pathname: this.state.LastVisit,
                        pageBackUser: this.state.PageBackUser,
                        pageBackPublic: this.state.PageBackPublic,
                        pageBackFavourites: this.state.PageBackFavourites,
                    }} >Powrót</Button>
                            </Col>

                            <Col className="align-self-center" >
                               {editButton}
                               {authorInfo}
                           
                            </Col>
                            <Col  >
                               {deleteButton}
                               {favouriteButton}
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
}


export default RecipePreview