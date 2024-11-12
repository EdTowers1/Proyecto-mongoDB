import React, { useState } from 'react';
import api from '../api';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, password });
      alert('Registro exitoso');
    } catch (error) {
      console.error(error);
      alert('Error al registrar');
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Registro</h2>
      <input type="text" placeholder="Nombre de usuario" value={username} onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Registrarse</button>
    </form>
  );
};

export default Register;