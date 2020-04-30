import React from 'react';
import { AuthHeaders } from '../helpers/AuthHeaders'
import { Authentication } from '../helpers/Authentication'

export const APIHelper = {
    Register,
    LogIn,
    GetUserData,
    EditUser
};

const API_URL = process.env.REACT_APP_API_URL;

function Register(Email, UserName, Password, ConfirmPassword) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, UserName, Password, ConfirmPassword })
    };

    return fetch(API_URL + '/api/Account/register', requestOptions)
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
};


function LogIn(username, password) {

    let body = new URLSearchParams();
    body.append("grant_type", "password");
    body.append("username", username);
    body.append("password", password);

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body
    };

    return fetch(API_URL + '/token', requestOptions)
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
};


function GetUserData() {

    let Authorization = AuthHeaders.GetBearer()

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization,
        },
    };

    return fetch(API_URL + '/api/User', requestOptions)
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


function EditUser(FavouriteRecipes) {

    let Authorization = AuthHeaders.GetBearer()

    let Id = Authentication.LoadUserId();
    let UserName = Authentication.LoadUserName();
    let Email = Authentication.LoadUserEmail();

    var formdata = new FormData();
    formdata.append("Id", Id);
    formdata.append("UserName", UserName);
    formdata.append("Email", Email);
    formdata.append("FavouriteRecipes", FavouriteRecipes);

    const requestOptions = {
        method: 'PUT',
        headers: {
            Authorization,
        },
        body: formdata,
    };

    return fetch(API_URL + `/api/User/${Id}`, requestOptions)
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
