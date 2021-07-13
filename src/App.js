import React, { useState, useEffect } from 'react';

import Login from './components/Login/Login';
import Home from './components/Home/Home';
import MainHeader from './components/MainHeader/MainHeader';

function App() {
  //I have to change the value of state from false to the one below
  //because the app still shows the login page after refreshing
  //even though the value is === '1'
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem('isLoggedIn')
  );

  //useEffect is used for data fetching
  useEffect(() => {
    //call localStorage after calling useState
    //this function executed after every component re-evaluation
    const storeUserLoggedIn = localStorage.getItem('isLoggedin');

    if (storeUserLoggedIn === '1') {
      setIsLoggedIn(true);
    }
  }, []);

  const loginHandler = (email, password) => {
    // We should of course check email and password
    // But it's just a dummy/ demo anyways
    //localStorage is a global variable
    localStorage.setItem('isLoggedIn', '1');
    setIsLoggedIn(true);
  };

  const logoutHandler = () => {
    //to clear the value of isLogged we use removeItem
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <React.Fragment>
      <MainHeader isAuthenticated={isLoggedIn} onLogout={logoutHandler} />
      <main>
        {!isLoggedIn && <Login onLogin={loginHandler} />}
        {isLoggedIn && <Home onLogout={logoutHandler} />}
      </main>
    </React.Fragment>
  );
}

export default App;
