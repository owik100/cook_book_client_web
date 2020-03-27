import React from 'react'

import logo from './logo.svg';
import './App.css';

import {Authentication} from '../src/helpers/Authentication'

function Main()
{
    return(
        <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
        <button
        onClick={() => {
          Authentication.DeleteToken();
        }}
      >
        Sign out
      </button>
      </div>
    ) 
}

export default Main