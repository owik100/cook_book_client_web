import React from 'react';
import {AuthHeaders} from '../helpers/AuthHeaders'

export const RecipesEndPointAPI = {
    GetAllRecipesLoggedUser,
    DownloadImage,
    DeleteRecipes,
    InsertRecipe
};

const API_URL = process.env.REACT_APP_API_URL;

function GetAllRecipesLoggedUser()
{
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

   return fetch( API_URL + '/api/Recipes/CurrentUserRecipes', requestOptions)
        .then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.json()
        })
        // catch error response and extract the error message
        .catch(async response => {
            const error = await response.text().then(text => text)
            return Promise.reject(error)
        })
}


function DownloadImage(id)
{
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

   return fetch( API_URL + `/api/Recipes/GetPhoto/${id}`, requestOptions)
        .then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.blob()
        })
        // catch error response and extract the error message
        .catch(async response => {
            const error = await response.text().then(text => text)
            return Promise.reject(error)
        })
}


function DeleteRecipes(id)
{
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

   return fetch( API_URL + `/api/Recipes/${id}`, requestOptions)
        .then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => {
            const error = await response.text().then(text => text)
            return Promise.reject(error)
        })
}


function InsertRecipe(RecipeName, Instructions, Ingredients, Image)
{
    let Authorization = AuthHeaders.GetBearer()

    var formdata = new FormData();
formdata.append("Name", RecipeName);
formdata.append("Instruction", Instructions);
formdata.append("Ingredients", Ingredients);
formdata.append("Image",Image);

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization,
        },
        body: formdata,
    };

   return fetch( API_URL + '/api/Recipes/', requestOptions)
        .then(response => {
            // reject not ok response
            if (!response.ok) {
                return Promise.reject(response)
            }
            return response.text()
        })
        // catch error response and extract the error message
        .catch(async response => {
            const error = await response.text().then(text => text)
            return Promise.reject(error)
        })
}