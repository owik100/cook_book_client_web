import React from 'react';
import Cookie from "js-cookie"

export const Authentication = {
    SaveToken,
    LoadToken,
    DeleteToken,
    isAuthenticated
};


function SaveToken(token, remember)
{
    if(remember)
    {
        Cookie.set("JWT", token, { expires: 7 });
    }
    else{
        Cookie.set("JWT", token)
    }
}

function LoadToken()
{
    return Cookie.get("JWT") ? Cookie.get("JWT") : null;
}

function DeleteToken()
{
    Cookie.remove('JWT');
}

function isAuthenticated()
{
    return Cookie.get("JWT") ? true : false;
}
