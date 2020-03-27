import React, { Component } from 'react'
import { Authentication } from "../helpers/Authentication"

class Recipes extends Component {

    constructor() {
        super()
        //this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount()
    {
       
    }

    render() {
        return (
            <div>
                <h1>Jestes zalogowany!</h1>
            </div>
        )
    }


}

export default Recipes