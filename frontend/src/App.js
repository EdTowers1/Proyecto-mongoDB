import React, { useState } from 'react';
// import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import AuthForm from './components/AuthForm';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <>
        <AuthForm setToken={setToken} />
          {/* <Register /> */}
          <Login setToken={setToken} />
        </>
      ) : (
        <Home token={token} />
      )}
    </div>
  );
};

export default App;

