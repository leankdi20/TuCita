import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './Filter.css';

export default function Filter({ onAplicar } ) {
    const [selectedProfesionales, setSelectedProfesionales] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const [selectedEstados, setSelectedEstados] = useState([]);
   

    
  
    

    const estados = [
        { value: 'pendiente', label: 'Pendiente' },
        { value: 'confirmada', label: 'Confirmada' },
        { value: 'cancelada', label: 'Cancelada' },
        { value: 'no_asistida', label: 'No asistida' },
        { value: 'completada', label: 'Completada' }
    ];

    useEffect(() => {
        axiosInstance.get('profesionales/')
            .then(res => {
                
                setProfesionales(res.data);
            })
            .catch(err => console.error('Error al cargar profesionales:', err));
    }, []);

    const toggleProfesional = (id) => {
        setSelectedProfesionales((prev) =>
            prev.includes(id)
                ? prev.filter((p) => p !== id)
                : [...prev, id]
        );
    };

    const toggleEstado = (estado) => {
        setSelectedEstados((prev) =>
            prev.includes(estado)
                ? prev.filter((e) => e !== estado)
                : [...prev, estado]
        );
    };

const handleAplicar = () => {
    const filtros = {
        profesionales: selectedProfesionales,
        estados: selectedEstados,
    };

    console.log('Filtros aplicados:', filtros); // ✅ ahora sí, ya está definido

    onAplicar(filtros);
};
    const handleLimpiar = () => {
        setSelectedProfesionales([]);
        setSelectedEstados([]);
        onAplicar({
            profesionales: [],
            estados: [],
        });
    
    };

    return (
        <div className="filter-container">
            <div className="filter-header">
                Filtros
            </div>

            <div className="filter-content">
                <div className="filter-leyenda">
                    <strong>🗂️ Leyenda de estados</strong>
                    <div className="leyenda-item">
                        <span className="leyenda-color" style={{ backgroundColor: '#f1c40f' }}></span> Pendiente
                    </div>
                    <div className="leyenda-item">
                        <span className="leyenda-color" style={{ backgroundColor: '#2ecc71' }}></span> Confirmada
                    </div>
                    <div className="leyenda-item">
                        <span className="leyenda-color" style={{ backgroundColor: '#e74c3c' }}></span> Cancelada
                    </div>
                    <div className="leyenda-item">
                        <span className="leyenda-color" style={{ backgroundColor: '#9b59b6' }}></span> No asistida
                    </div>
                    <div className="leyenda-item">
                        <span className="leyenda-color" style={{ backgroundColor: '#3498db' }}></span> Completada
                    </div>
                </div>

                <div className="filter-section">
                    <strong>Profesional</strong>
                        {profesionales.map((prof) => (
                            prof.usuario ? (
                                <div key={prof.id}>
                                <input
                                    type="checkbox"
                                    checked={selectedProfesionales.includes(prof.id)}
                                    onChange={() => toggleProfesional(prof.id)}
                                />
                                <label>{prof.usuario?.nombre} {prof.usuario?.apellido}</label>
                            </div>
                            ) : null
                        ))}
                </div>

                <div className="filter-section">
                    <strong>Estado de la cita</strong>
                    {estados.map((estado) => (
                        <div key={estado.value}>
                            <input
                                type="checkbox"
                                checked={selectedEstados.includes(estado.value)}
                                onChange={() => toggleEstado(estado.value)}
                            />
                            <label>{estado.label}</label>
                        </div>
                    ))}
                </div>


                <div className="filter-buttons">
                    <button onClick={handleAplicar}>Aplicar</button>
                    <button onClick={handleLimpiar}>Limpiar</button>
                </div>
            </div>
        </div>
    );
}