import './Recuperar.css';
import React, { useState } from 'react';
import logo from '../assets/tuCita.png';
import { Link  } from 'react-router-dom';
 // Podés renombrar como 'Auth.css' si lo usás en varios

export default function Recuperar() {
    const [correo, setCorreo] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aquí deberías hacer una llamada al backend para enviar el email
        alert('Instrucciones enviadas a: ' + correo);
    };

    return (
        <div className="login-container">

        <div className="login-right">
            <form className="login-form" onSubmit={handleSubmit}>
            <h1>Recuperar contraseña</h1>
            <input
                type="email"
                placeholder="Correo electrónico"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
            />
            <button type="submit">Enviar instrucciones</button>
            <small>Te enviaremos un enlace para restablecer tu contraseña</small>
            </form>
            <div className="login-footer">
            <p>¿Ya la recuperaste? <Link to="/">Iniciar sesión</Link></p>
            </div>
        </div>
        </div>
    );
}
