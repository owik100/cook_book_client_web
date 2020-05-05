import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col,  Button, Alert, Form, ListGroup } from 'react-bootstrap';
import { Link, Redirect } from "react-router-dom";
import bsCustomFileInput from 'bs-custom-file-input'

class AddOrEdit extends Component {

    constructor(props) {
        super(props)

        this.state = {
            Edit: false,
            InfoMessage: "",
            DuringOperation: false,
            CanSubmit: false,
            RecipeName: "",
            Instructions: "",
            Ingredients: [],
            IngredientsInput: "",
            SelectedIngredient: "",
            isPublic: false,
            Image: null,
            ImagePreview: null,
            ImageName: "",
            ID: "",
            OperationComplete: false
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onChangeFile = this.onChangeFile.bind(this);
        this.handleIngredientAdd = this.handleIngredientAdd.bind(this);
        this.handleRecipeClick = this.handleRecipeClick.bind(this);
        this.handleIngredientRemove = this.handleIngredientRemove.bind(this);
        this.DeleteImage = this.DeleteImage.bind(this);
        this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init()
        this.setState({ ImagePreview: '/food template.png' })

        try {
            if (this.props.match.params.id != 0) {
                this.setState({ Edit: true })

                //Jezeli edytujemy, wez dane z prospow
                this.setState({ RecipeName: this.props.location.recipeProps.Name })
                this.setState({ Instructions: this.props.location.recipeProps.Instructions })
                this.setState({ Ingredients: this.props.location.recipeProps.Ingredients })
                this.setState({ Image: this.props.location.recipeProps.Image })
                this.setState({ ImagePreview: this.props.location.recipeProps.Image })
                this.setState({ ImageName: this.props.location.recipeProps.nameOfImage })
                this.setState({ ID: this.props.location.recipeProps.ID })
                this.setState({ isPublic: this.props.location.recipeProps.isPublic })
            }

            //Jak nie da rady pobierz z API
        } catch (error) {
            this.setState({ DuringOperation: true })

            let result = RecipesEndPointAPI.GetRecipeByID(this.props.match.params.id)
            result.then(data => {
                console.log("Pobrano przepis")
                this.setState({ RecipeName: data.name })
                this.setState({ Instructions: data.instruction })
                this.setState({ Ingredients: data.ingredients })
                this.setState({ ImageName: data.nameOfImage })
                this.setState({ ID: data.recipeId })
                this.setState({ isPublic: data.isPublic })

                this.setState({ DuringOperation: false })
                this.DonwloadRecipeImage();
            })
                .catch(error => {
                    //Connection problem
                    if (error == "TypeError: response.text is not a function") {
                        console.log('Problem z połączeniem')
                        this.setState({ InfoMessage: 'Problem z połączeniem'})
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
    }


    DonwloadRecipeImage() {
        let that = this
        let outside

        if (this.state.ImageName === null) {
            this.setState({ ImagePreview: '/food template.png' })
        }
        else {

            this.setState({ DuringOperation: true })
            let result = RecipesEndPointAPI.DownloadImage(this.state.ImageName)
            result.then(data => {
                console.log("Pobrano obrazek")
                outside = URL.createObjectURL(data)
                this.setState({ Image: outside })
                this.setState({ ImagePreview: outside })
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


    handleChange(event) {
        const { name, value } = event.target
        this.setState({
            [name]: value
        })
    }

    handleCheckboxChange = event =>
    this.setState({ isPublic: event.target.checked })

    handleIngredientAdd(e) {
        const { IngredientsInput, Ingredients } = this.state;

        const nextState = [...Ingredients, IngredientsInput];
        this.setState({ Ingredients: nextState, IngredientsInput: '' });
    }

    handleRecipeClick(e) {
        this.setState({ SelectedIngredient: e.target.innerHTML })
    }

    handleIngredientRemove(e) {
        const { Ingredients, SelectedIngredient } = this.state;
        const nextState = Ingredients.filter(x => x !== SelectedIngredient)
        this.setState({ Ingredients: nextState, SelectedIngredient: "" });
    }

    onChangeFile(e) {
        this.setState({ InfoMessage: "" })
        let fileName = e.target.files[0].name
        let fileExt = fileName.split('.').pop()

        if (fileExt === "jpg" || fileExt === "jpeg" || fileExt === "gif" || fileExt === "png") {
            this.setState({ Image: e.target.files[0] })
            this.setState({ ImageName: fileName })

            var file = e.target.files[0];
            var reader = new FileReader();
            var url = reader.readAsDataURL(file);

            reader.onloadend = function (e) {
                this.setState({
                    ImagePreview: [reader.result]
                })
            }.bind(this);
        }
        else {
            this.setState({ InfoMessage: "Wybierz poprawny format pliku!" })
        }
    }

    handleSubmit(event) {
        if (this.CanSubmit()) {
            this.setState({ DuringOperation: true })
            this.setState({ InfoMessage: ""})

            if (this.state.Edit) {
                let result = RecipesEndPointAPI.PutRecipes(this.state.ID, this.state.ID, this.state.RecipeName, this.state.Instructions, this.state.Ingredients, this.state.Image, this.state.ImageName, this.state.isPublic)
                result.then(data => {
                    console.log("Przepis zaktualizowany")
                    this.setState({ DuringOperation: false })
                    this.setState({ OperationComplete: true })
                })
                    .catch(error => {
                        //Connection problem
                        if (error == "TypeError: response.text is not a function") {
                            console.log('Problem z połączeniem')
                            this.setState({ InfoMessage: 'Problem z połączeniem'})
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
            else {
                let result = RecipesEndPointAPI.InsertRecipe(this.state.RecipeName, this.state.Instructions, this.state.Ingredients, this.state.Image, this.state.isPublic)
                result.then(data => {
                    console.log("Przepis dodany")
                    this.setState({ DuringOperation: false })
                    this.setState({ OperationComplete: true })
                })
                    .catch(error => {
                        //Connection problem
                        if (error == "TypeError: response.text is not a function") {
                            console.log('Problem z połączeniem')
                            this.setState({ InfoMessage: 'Problem z połączeniem'})
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

        }
        event.preventDefault();
    }

    DeleteImage() {
        this.setState({ ImageName: "" })
        this.setState({ Image: null })
        this.setState({ ImagePreview: '/food template.png' })

    }

    CanSubmit() {
        let output = false;
        if (this.state.RecipeName && this.state.Instructions && this.state.Ingredients.length > 0 && !this.state.DuringOperation && this.state.InfoMessage == "") {
            output = true;
        }
        return output;
    }

    SubmitMessage() {
        if (this.state.DuringOperation) {
            return (
                <div class="d-flex justify-content-center">
                    <Spinner animation="grow" variant="primary" role="status">
                        <span className="sr-only my-auto mx-auto">Loading...</span>
                    </Spinner>
                </div>
            )
        }
        else if (this.state.InfoMessage != "") {
            return (
                <Alert className="text-center mt-3"  variant="danger">
                {this.state.InfoMessage}
              </Alert>
              )
        }
    }

    render() {

        if (this.state.OperationComplete === true) {
            return <Redirect to='/UserRecipes' />
        }

        const ingredients = this.state.Ingredients.map(item =>
            <ListGroup.Item as="li" active={this.state.SelectedIngredient === item} className="Clickable" action onClick={this.handleRecipeClick}>
                {item}
            </ListGroup.Item>
        )

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

            return (

                <Form id="registerForm" onSubmit={this.handleSubmit}>

                    <Container>
                        <Row>
                            <Col md={12}>
                                {this.SubmitMessage()}

                                <Form.Group controlId="formName">
                                    {/* <Form.Label   className="text-center" style={{width: "100%"}}>Nazwa przepisu:</Form.Label> */}
                                    <h3 className="text-center mt-3">Nazwa przepisu:</h3>
                                    <Form.Control type="text" size="lg" name="RecipeName" required onChange={this.handleChange} value={this.state.RecipeName} />
                                </Form.Group>
                            </Col>


                            <Col md={8}>

                                <Form.Group controlId="formInstructions">
                                    {/* <Form.Label className="text-center" style={{width: "100%"}} >Przepis:</Form.Label> */}
                                    <h3 className="text-center">Przepis:</h3>
                                    <Form.Control as="textarea" style={{ height: "400px" }} size="lg" type="text" name="Instructions" required onChange={this.handleChange} value={this.state.Instructions} />
                                </Form.Group>

                                <Form.Group controlId="formIsPublic">
                                <Form.Check type="checkbox" label="Przepis publiczny" className="CheckBoxIsRecipePublic" name="isPublic" onChange={this.handleCheckboxChange} checked={this.state.isPublic} />
                                </Form.Group>
                            </Col>

                            <Col md={4}>
                                <Form.Group controlId="formIngredients">
                                    {/* <Form.Label>Składniki</Form.Label> */}
                                    <h3 className="text-center">Składniki:</h3>
                                    <Form.Control type="text" name="IngredientsInput" onChange={this.handleChange} value={this.state.IngredientsInput} />
                                </Form.Group>

                                <div class="d-flex justify-content-center mb-3">
                                    <Button disabled={!this.state.IngredientsInput} onClick={this.handleIngredientAdd} className="mr-3">Dodaj</Button>
                                    <Button disabled={!this.state.SelectedIngredient} onClick={this.handleIngredientRemove}>Usuń</Button>
                                </div>
                                <ListGroup id="IngredientsGroup" as="ul">
                                    {ingredients}
                                </ListGroup>
                            </Col>

                            <Col md={12}>
                                <h3 className="text-center">Obrazek:</h3>
                            </Col>

                            <Col md={6}>
                                <div class="custom-file mb-3">
                                    <input id="formFile" type="file" class="custom-file-input" accept=".png, .jpg, .jpeg, .gif" onChange={this.onChangeFile} />
                                    <label class="custom-file-label" for="inputGroupFile01">Wybierz obrazek</label>

                                </div>
                            </Col>

                            <Col md={2}>
                                <div class="custom-file mb-3">

                                    <div class="d-flex justify-content-center">
                                        <Button variant="primary" onClick={this.DeleteImage} size="lg" disabled={!this.state.ImageName}>
                                            Usuń obrazek
                                        </Button>
                                    </div>
                                </div>
                            </Col>

                            <Col md={4}>
                                <img className="smallImg mx-auto d-block mb-3" src={this.state.ImagePreview} />
                            </Col>
                            <Col md={12}>
                                <div class="d-flex justify-content-center">
                                    <Button variant="primary" type="submit" size="lg" disabled={!this.CanSubmit()}>
                                        {this.state.Edit ? "Zaaktualizuj przepis" : "Dodaj przepis"}
                                    </Button>
                                </div>

                                <div class="d-flex justify-content-center mb-3">
                                    <Button variant="outline-primary" as={Link} to="/UserRecipes" className="mt-3"  >
                                        Wróć
                                </Button>
                                </div>
                            </Col>
                        </Row>
                    </Container>
                </Form>
            )
        }
    }
}


export default AddOrEdit 