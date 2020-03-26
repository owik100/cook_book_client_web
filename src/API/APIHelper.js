import React from 'react';
import { ResponsiveEmbed } from 'react-bootstrap';

export const APIHelper = {
    Register,
};


function Register(Email, UserName, Password, ConfirmPassword) {
    
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Email, UserName, Password, ConfirmPassword })
    };

    let info ="init";

   fetch('https://localhost:44342/api/Account/register', requestOptions)
   .then(response => {
       // reject not ok response
       if (!response.ok) {
           return Promise.reject(response)
       }
       return response.text() // or return response.text()
   })
   // catch error response and extract the error message
   .catch(async response => {
       const error = await response.text().then(text => text)
       if(error == null){
        info ="server problem!";
        return info;
       }
       return Promise.reject(error)
   })
   .then(data => {
    info ="Succes!"
    return info;
   })
   .catch(error => {
       //Connection problem
       if(error =="TypeError: response.text is not a function")
       {
        info='Connection problem';
        return info;
       }
       else{
        info=error
        return info;
       }        
   })

    };
