import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './Equipo.css';

export default function Equipo() {
    const [miembros, setMiembros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMiembros();
    }, []);

    const fetchMiembros = async () => {
        try {
        const response = await axiosInstance.get('profesionales/');
        setMiembros(response.data);
        } catch (error) {
        console.error('Error al traer los miembros:', error);
        } finally {
        setLoading(false);
        }
    };

    const handleFotoChange = async (e, miembroId) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('foto', file);

        try {
        await axiosInstance.patch(`profesionales/${miembroId}/`, formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });
        fetchMiembros(); // recargar lista
        } catch (error) {
        console.error('Error al subir la foto:', error);
        }
    };

    return (
        <div className="equipo-container">
        
        

        {loading ? (
            <p>Cargando miembros...</p>
        ) : (
            <div className="equipo-container">
                {miembros.map((miembro) => (
                    <div className="equipo-card" key={miembro.id}>
                    <img
                        src={miembro.foto || '/default.jpg'}
                        alt={miembro.usuario.nombre}
                        className="equipo-img"
                    />
                    <h3>
                        <span className="equipo-nombre">{miembro.usuario.nombre}</span>, {miembro.usuario.apellido}
                    </h3>

                    <p style={{ fontSize: '0.75rem', color: '#666' }}>
                        {miembro.edad} Años &nbsp; | &nbsp; 📞 {miembro.telefono} 
                    </p>
                    <p style={{ fontSize: '0.75rem', color: '#666' }}>
                        📧 {miembro.usuario.correo} &nbsp; | &nbsp; 📍 {miembro.ciudad} 
                    </p>

                    <div className="equipo-tags">
                        <span className="tag comprensible">{miembro.Profesional}</span>
                        
                    </div>

                    <div className="equipo-precios">
                        <span className="costo">₡{miembro.precio}</span>
                        <span className="ganancia">₡{miembro.ganancias}CRC</span>
                    </div>

                    <label className="equipo-edit-btn">
                        Cambiar foto
                        <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFotoChange(e, miembro.id)}
                        style={{ display: 'none' }}
                        />
                    </label>
                    </div>
                ))}
                </div>

            )}
            </div>
        );
    }
