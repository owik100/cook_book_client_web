import React from 'react';
import { ResponsiveEmbed } from 'react-bootstrap';

function APIHelper(email, login, password) {
    
let data;

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, login, password })
    };

    return fetch('https://localhost:44342/api/Account/register', requestOptions)
    .then(handleResponse=>handleResponse.JSON())
    .then(handleResponse => { data = handleResponse.data
       

    
    });

}


export default APIHelper