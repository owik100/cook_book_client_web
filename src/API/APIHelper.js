import React from 'react';
import { ResponsiveEmbed } from 'react-bootstrap';
import { Authentication } from "../helpers/Authentication"

export const APIHelper = {
    Register,
    LogIn,
    GetUserData
};


function Register(Email, UserName, Password, ConfirmPassword) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, UserName, Password, ConfirmPassword })
    };

    return fetch('https://localhost:44342/api/Account/register', requestOptions)
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

    return fetch('https://localhost:44342/token', requestOptions)
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
    let bearer = 'bearer ' + Authentication.LoadToken()
    console.log(bearer)

    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': bearer
        },
    };

   return fetch('https://localhost:44342/api/User', requestOptions)
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
