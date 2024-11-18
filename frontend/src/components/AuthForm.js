import React, { useState } from 'react';
import { toast, Toaster } from 'react-hot-toast';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const AuthForm = ({ setToken }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState('');
  const navigate = useNavigate(); // Inicializamos el hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    
    try {
      if (isLogin) {
        const response = await api.post('/auth/login', { username, password });
        const { token } = response.data;
        setToken(token);
        toast.success('Inicio de sesión exitoso');
        navigate('/home');
      } else {
        await api.post('/auth/register', { username, password });
        toast.success('Registro exitoso');
        setIsLogin(true); // Cambiar a login después de registro exitoso
      }
    } catch (error) {
      console.error(error);
      if (isLogin) {
        toast.error('Error al iniciar sesión');
      } else {
        toast.error('Error al registrar');
      }
      setFormError(isLogin ? 'Error al iniciar sesión' : 'Error al registrar');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 flex items-center justify-center px-4 py-12 perspective-1000">
      <div className="w-full max-w-md space-y-8 transform-gpu transition-all duration-300 hover:translate-y-[-10px]">
        <div className="bg-zinc-900/90 backdrop-blur-sm p-8 rounded-2xl shadow-[0_20px_70px_-15px_rgba(30,215,96,0.3)] hover:shadow-[0_30px_100px_-20px_rgba(30,215,96,0.4)] transition-all duration-300">
          {/* Logo */}
          <div className="flex justify-center transform transition-transform duration-300 hover:scale-110">
            <svg className="w-12 h-12 text-green-500" viewBox="0 0 24 24">
              <path 
                fill="currentColor" 
                d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"
              />
            </svg>
          </div>

          {/* Form Container */}
          <div className="relative mt-8">
            {/* Auth Toggle */}
            <div className="flex justify-center space-x-4 text-sm mb-8">
              <button 
                type="button"
                onClick={() => setIsLogin(true)}
                className={`pb-1 font-semibold transition-all duration-300 ${
                  isLogin 
                    ? 'text-white border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SIGN IN
              </button>
              <button 
                type="button"
                onClick={() => setIsLogin(false)}
                className={`pb-1 font-semibold transition-all duration-300 ${
                  !isLogin 
                    ? 'text-white border-b-2 border-green-500' 
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                SIGN UP
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="transform transition-all duration-200 hover:translate-x-1">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 backdrop-blur-sm rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:bg-zinc-800"
                  placeholder="Username"
                />
              </div>

              <div className="transform transition-all duration-200 hover:translate-x-1">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-zinc-800/50 backdrop-blur-sm rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 hover:bg-zinc-800"
                  placeholder="Password"
                />
              </div>

              {isLogin && (
                <div className="flex items-center transform transition-all duration-200 hover:translate-x-1">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-green-500 bg-zinc-800 rounded border-gray-600 focus:ring-green-500"
                  />
                  <label className="ml-2 text-sm text-gray-400">
                    stay signed in
                  </label>
                </div>
              )}

              {formError && (
                <div className="text-red-500 text-sm text-center">
                  {formError}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-green-500 text-white rounded-md hover:bg-green-400 transform transition-all duration-300 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-green-500/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                {isLogin ? 'SIGN IN' : 'SIGN UP'}
              </button>

              {isLogin && (
                <div className="text-center transform transition-all duration-200 hover:translate-y-[-2px]">
                  {/* <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                    Forgot Password?
                  </a> */}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AuthForm;