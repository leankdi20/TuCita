import './Login.css';

import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { setAuthToken } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/tuCita.png';




export default function Login() {
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('token/', {
                username: correo,
                password: contrasena,
            });
            localStorage.setItem('user', JSON.stringify(response.data));
            setAuthToken(response.data.token);
            const userResponse = await axiosInstance.get('usuarios/');
            // Encontrar el usuario actual por correo
            const usuarioActual = userResponse.data.find(u => u.correo === correo);
            localStorage.setItem('user', JSON.stringify({
                token: response.data.token,
                usuario: usuarioActual
            }));
            navigate('/dashboard');
            } catch (error) {
            setError('Credenciales incorrectas. Por favor, inténtalo de nuevo.');
            }
        };

    return (
    <div className="login-container">
        <div className="left-panel">
            <div className="login-left">
            <img src={logo} alt="Logo TuCitas" />
            </div>
        </div>
        <div className="right-panel">
            <form className="login-form" onSubmit={handleLogin}>
            <h1>Login</h1>
            <input type="email" name="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} />
            <input type="password" name="password" placeholder="Contraseña" value={contrasena} onChange={(e) => setContrasena(e.target.value)} />
            <button type="submit">Iniciar sesión</button>
            <small>
                ¿Olvidaste tu contraseña?   
                <a href="#" className="login-footer" onClick={e => {
                        e.preventDefault();
                        navigate('/recuperar');
                    }}
                >
                    Recuperar contraseña
                </a>
            </small>
            </form>
            {error && <p className="error-message">{error}</p>}

        </div>
    </div>
    );
}