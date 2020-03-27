import React from 'react';
import Cookie from "js-cookie"

export const Authentication = {
    SaveToken,
    LoadToken,
    LogOut,
    isAuthenticated,
    SaveUserData,
    LoadUserEmail,
    LoadUserId,
    LoadUserName
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

function LogOut()
{
    Cookie.remove('JWT');
    Cookie.remove('userName');
    Cookie.remove('email');
    Cookie.remove('id');
}

function isAuthenticated()
{
    return Cookie.get("JWT") ? true : false;
}

function SaveUserData(userJson)
{
    Cookie.set("userName", userJson.userName, { expires: 7 });
    Cookie.set("email", userJson.email, { expires: 7 });
    Cookie.set("id", userJson.id, { expires: 7 });
}

function LoadUserName()
{
    return Cookie.get("userName") ? Cookie.get("userName") : null;
}

function LoadUserEmail()
{
    return Cookie.get("email") ? Cookie.get("email") : null;
}

function LoadUserId()
{
    return Cookie.get("id") ? Cookie.get("id") : null;
}
