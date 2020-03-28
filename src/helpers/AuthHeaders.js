import React from 'react';
import { Authentication } from "../helpers/Authentication"

export const AuthHeaders = {
    GetBearer,
};

function GetBearer() {
    let authHeader = 'bearer ' + Authentication.LoadToken()

    return authHeader;
}

