import React, { useState, useEffect } from 'react'

function About()
{
    const [appVersion, setAppVersion] = useState();

    const ReactAppVersion = process.env.REACT_APP_VERSION;

    useEffect(() => {setAppVersion(ReactAppVersion)});

    return(
        <div className="App">
        <header className="App-header">
          <img src='/blankicon256.png'/>
          <p>
           CookBook {appVersion}
          </p>
          <a
            className="App-link"
            href="https://github.com/owik100/Cook-Book"
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