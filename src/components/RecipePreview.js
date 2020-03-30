import React, { Component } from 'react'
import { RecipesEndPointAPI } from '../API/RecipesEndPointAPI'
import { Spinner, Container, Row, Col, CardGroup, Card, CardDeck, CardColumns } from 'react-bootstrap';

class RecipePreview extends Component {

    constructor(props) {
        super(props)

        this.state = {
            Name: this.props.location.myCustomProps.item.name,
            Instructions: this.props.location.myCustomProps.item.instruction,
            Ingredients: this.props.location.myCustomProps.item.ingredients,
            Image: this.props.location.myCustomProps.item.image,
        }



    }

    render() {

        const ingredients = this.state.Ingredients.map(item =>

    <li>
        {item}
    </li>

        )


        return (
            <div>
                <h1>{this.state.Name}</h1>
                <h2>{this.state.Instructions}</h2>
               <img src={this.state.Image}></img>
               <ul>
               {ingredients}
               </ul>
   
            </div>


        )
    }

}


export default RecipePreview