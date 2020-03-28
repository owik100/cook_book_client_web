import React from 'react';
import {AuthHeaders} from '../helpers/AuthHeaders'

export const RecipesEndPointAPI = {
    GetAllRecipesLoggedUser
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