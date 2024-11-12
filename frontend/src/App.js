import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';

const App = () => {
  const [token, setToken] = useState(null);

  return (
    <div>
      {!token ? (
        <>
          <Register />
          <Login setToken={setToken} />
        </>
      ) : (
        <Home token={token} />
      )}
    </div>
  );
};

export default App;

