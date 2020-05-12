import React, { useState, useEffect } from 'react'

function About()
{
    const [appVersion, setAppVersion] = useState();

    const ReactAppVersion = process.env.REACT_APP_VERSION;

    useEffect(() => {setAppVersion(ReactAppVersion)});

    return(
        <div className="App">
        <header className="App-header">
          <img src = {process.env.REACT_APP_PUBLIC_URL + '/blankicon256.png'} alt="logo"/>
          <p>
           CookBook {appVersion}
          </p>
          <a
            className="App-link"
            href="https://github.com/owik100/cook_book_client_web"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </header>
      </div>
    )
}

export default About