import userIcon from '../assets/user.png'; 
import './Navbar.css'
import React, { useState, useEffect,useRef, use  } from 'react';


export default function Navbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (error) {
                console.error('Error al parsear el usuario:', error);
            }
        }
    }, []);

    const fotoSrc = user?.foto ? user.foto : userIcon;

    return (
        <header className="header">
            <input type="text" placeholder="Buscar..." className="search-input" />
            <div className="user-info">
                <img src={fotoSrc} alt="Usuario" className="user-avatar" />
                <div>
                    <strong>
                        {user?.usuario ? `${user.usuario.nombre} ${user.usuario.apellido}` : 'Usuario no autenticado'}
                    </strong>
                    <p>{user?.usuario ? user.usuario.correo : 'Correo no encontrado'}</p>
                </div>
            </div>
        </header>
    );
}