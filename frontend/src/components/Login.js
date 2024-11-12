import React, { useState } from 'react';
import api from '../api';

const Login = ({ setToken }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { username, password });
      const { token } = response.data;
      setToken(token); // Guarda el token en el estado de la aplicación
      alert('Inicio de sesión exitoso');
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Iniciar Sesión</h2>
      <input type="text" placeholder="Usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Iniciar Sesión</button>
    </form>
  );
};

export default Login;
