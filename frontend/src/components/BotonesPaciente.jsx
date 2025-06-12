import React, { useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import './BotonesCalendario.css'; // si tenés estilos comunes

export default function BotonesPaciente({abrir, onClose, onPacienteCreado }) {
    

    const [formPaciente, setFormPaciente] = useState({
        nombre: '',
        apellido: '',
        edad: '',
        correo: '',
        telefono: '',
        cedula: '',
        alergias: '',
        enfermedades_previas: '',
        observaciones_clinicas: '',
        estado_paciente: 'activo'
    });

    const handleSubmitPaciente = (e) => {
        e.preventDefault();

        axiosInstance.post('pacientes/', formPaciente)
            .then(res => {
                alert('Paciente creado correctamente');
                if (onClose) onClose();
            
                // Limpiar form:
                setFormPaciente({
                    nombre: '',
                    apellido: '',
                    edad: '',
                    correo: '',
                    telefono: '',
                    cedula: '',
                    alergias: '',
                    enfermedades_previas: '',
                    observaciones_clinicas: '',
                    estado_paciente: 'activo'
                });
                // Callback para refrescar lista en el padre:
                if (onPacienteCreado) {
                    onPacienteCreado();
                }
            })
            .catch(err => console.error('Error creando paciente:', err));
    };

    return (
        <>
             {abrir && (
                <div className="form-overlay">
                    <div className="form-panel">
                        <button
                            type="button"
                            className="close-button"
                            onClick={() => {
                                if (onClose) onClose();
                            }}
                        >
                            &times;
                        </button>
                        <h3>Crear nuevo paciente</h3>
                        <form onSubmit={handleSubmitPaciente}>
                            <label>Nombre:</label>
                            <input
                                type="text"
                                value={formPaciente.nombre}
                                onChange={(e) => setFormPaciente({ ...formPaciente, nombre: e.target.value })}
                                required
                            />
                            <label>Apellido:</label>
                            <input
                                type="text"
                                value={formPaciente.apellido}
                                onChange={(e) => setFormPaciente({ ...formPaciente, apellido: e.target.value })}
                                required
                            />
                            <label>Edad:</label>
                            <input
                                type="number"
                                value={formPaciente.edad}
                                onChange={(e) => setFormPaciente({ ...formPaciente, edad: e.target.value })}
                                required
                            />
                            <label>Correo:</label>
                            <input
                                type="email"
                                value={formPaciente.correo}
                                onChange={(e) => setFormPaciente({ ...formPaciente, correo: e.target.value })}
                                required
                            />
                            <label>Teléfono:</label>
                            <input
                                type="text"
                                value={formPaciente.telefono}
                                onChange={(e) => setFormPaciente({ ...formPaciente, telefono: e.target.value })}
                                required
                            />
                            <label>Cédula:</label>
                            <input
                                type="text"
                                value={formPaciente.cedula}
                                onChange={(e) => setFormPaciente({ ...formPaciente, cedula: e.target.value })}
                                required
                            />
                            <label>Alergias:</label>
                            <input
                                type="text"
                                value={formPaciente.alergias}
                                onChange={(e) => setFormPaciente({ ...formPaciente, alergias: e.target.value })}
                            />
                            <label>Enfermedades previas:</label>
                            <input
                                type="text"
                                value={formPaciente.enfermedades_previas}
                                onChange={(e) => setFormPaciente({ ...formPaciente, enfermedades_previas: e.target.value })}
                            />
                            <label>Observaciones clínicas:</label>
                            <input
                                type="text"
                                value={formPaciente.observaciones_clinicas}
                                onChange={(e) => setFormPaciente({ ...formPaciente, observaciones_clinicas: e.target.value })}
                            />
                            <label>Estado del paciente:</label>
                            <select
                                value={formPaciente.estado_paciente}
                                onChange={(e) => setFormPaciente({ ...formPaciente, estado_paciente: e.target.value })}
                                required
                            >
                                <option value="activo">Activo</option>
                                <option value="inactivo">Inactivo</option>
                                <option value="pendiente">Pendiente</option>
                            </select>
                            <div style={{ marginTop: '10px' }}>
                                <button type="submit">Guardar paciente</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}