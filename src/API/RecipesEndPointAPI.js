import React from 'react';
import { AuthHeaders } from '../helpers/AuthHeaders'

export const RecipesEndPointAPI = {
    GetAllRecipesLoggedUser,
    DownloadImage,
    DeleteRecipes,
    InsertRecipe,
    GetRecipeByID,
    PutRecipes,
    GetPublicRecipes,
    GetFavouritesRecipes
};

const API_URL = process.env.REACT_APP_API_URL;

async function GetRecipeByID(Id) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await fetch(API_URL + `/api/Recipes/${Id}`, requestOptions)
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


async function GetAllRecipesLoggedUser(PageSize, PageNumber) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await  fetch(API_URL + `/api/Recipes/CurrentUserRecipes/${PageSize}/${PageNumber}`, requestOptions)
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


async function GetPublicRecipes(PageSize, PageNumber) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await  fetch(API_URL + `/api/Recipes/GetPublicRecipes/${PageSize}/${PageNumber}`, requestOptions)
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

async function GetFavouritesRecipes(PageSize, PageNumber) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await  fetch(API_URL + `/api/Recipes/GetFavouritesRecipes/${PageSize}/${PageNumber}`, requestOptions)
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


async function DownloadImage(id) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await  fetch(API_URL + `/api/Recipes/GetPhoto/${id}`, requestOptions)
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


async function DeleteRecipes(id) {
    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return await  fetch(API_URL + `/api/Recipes/${id}`, requestOptions)
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


async function InsertRecipe(RecipeName, Instructions, IngredientsArr, Image, isPublic) {
    let Authorization = AuthHeaders.GetBearer()

    let Ingredients = IngredientsArr.join(";");

    var formdata = new FormData();
    formdata.append("Name", RecipeName);
    formdata.append("Instruction", Instructions);
    formdata.append("Ingredients", Ingredients);
    formdata.append("Image", Image);
    formdata.append("isPublic", isPublic);

    const requestOptions = {
        method: 'POST',
        headers: {
            Authorization,
        },
        body: formdata,
    };

    return await  fetch(API_URL + '/api/Recipes/', requestOptions)
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

async function PutRecipes(id, RecipeId, RecipeName, Instructions, IngredientsArr, Image, NameOfImage, isPublic) {
    let Authorization = AuthHeaders.GetBearer()

    let Ingredients = IngredientsArr.join(";");

    var formdata = new FormData();
    formdata.append("Name", RecipeName);
    formdata.append("Instruction", Instructions);
    formdata.append("Ingredients", Ingredients);
    formdata.append("Image", Image);
    formdata.append("NameOfImage", NameOfImage);
    formdata.append("RecipeId", RecipeId);
    formdata.append("isPublic", isPublic);

    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization,
        },
        body: formdata,
    };

    return await fetch(API_URL + `/api/Recipes/${id}`, requestOptions)
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