import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './BotonesCalendario.css';
import { useNavigate } from 'react-router-dom';

export default function BotonesCalendario({ onCitaCreada }) {
    const navigate = useNavigate();

    const [showForm, setShowForm] = useState(false);
    const [showFormPaciente, setShowFormPaciente] = useState(false);
    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const bloques = [
        '08:00', '08:30', '09:00', '09:30',
        '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30'
    ];
    const [formData, setFormData] = useState({
        pacienteId: '',
        profesionalId: '',
        motivo_consulta: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
    });
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
    const [horasOcupadas, setHorasOcupadas] = useState([]);
    const [bloquesOcupadosSet, setBloquesOcupadosSet] = useState(new Set());
    const [bloquesInicioCita, setBloquesInicioCita] = useState(new Set());
    


    const bloquesDisponiblesFin = () => {
        const indexInicio = bloques.indexOf(formData.hora_inicio);

        if (indexInicio === -1) return [];

        const disponibles = [];

        for (let i = indexInicio + 1; i < bloques.length; i++) {
            const bloque = bloques[i];

            // Si este bloque es el inicio de una cita, NO lo incluyo y CORTO
            if (bloquesInicioCita.has(bloque)) {
                 // PERMITO poner este bloque como fin (para terminar justo antes de la cita siguiente)
                disponibles.push(bloque);
                break;
            }

            disponibles.push(bloque);
        }

        return disponibles;
    };

    useEffect(() => {
        axiosInstance.get('pacientes/')
            .then(res => setPacientes(res.data))
            .catch(err => console.error('Error cargando pacientes:', err));

        axiosInstance.get('profesionales/')  
        .then(res => setProfesionales(res.data))
        .catch(err => console.error('Error cargando profesionales:', err));
        
    }, []);

    useEffect(() => {
        if (formData.profesionalId && formData.fecha) {
            axiosInstance.get('citas/', {
                params: {
                    profesional: formData.profesionalId,
                    fecha__date: formData.fecha
                }
            })
            .then(res => {
                const ocupadasSet = new Set();
                const bloquesInicioCita = new Set();

                res.data.forEach(cita => {
                    const inicio = cita.hora_inicio.slice(0,5);
                    const fin = cita.hora_fin.slice(0,5);

                    const inicioIndex = bloques.indexOf(inicio);
                    const finIndex = bloques.indexOf(fin);

                    // Marcar bloques ocupados
                    for (let i = inicioIndex; i < finIndex; i++) {
                        if (i >= 0 && i < bloques.length) {
                            ocupadasSet.add(bloques[i]);
                        }
                    }

                    // Marcar inicio de la cita
                    if (inicioIndex >= 0 && inicioIndex < bloques.length) {
                        bloquesInicioCita.add(bloques[inicioIndex]);
                    }
                });

                setBloquesOcupadosSet(ocupadasSet);
                setBloquesInicioCita(bloquesInicioCita);
            })
            .catch(err => console.error('Error cargando citas del día:', err));
        } else {
            setBloquesOcupadosSet(new Set());
        }
    }, [formData.profesionalId, formData.fecha]);
    

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            paciente: formData.pacienteId,
            profesional: formData.profesionalId,
            motivo_consulta: formData.motivo_consulta,
            fecha: `${formData.fecha}T${formData.hora_inicio}:00`,  // Combinás fecha + hora
            hora_inicio: `${formData.hora_inicio}:00`,
            hora_fin: `${formData.hora_fin}:00`,
            observaciones: '',  // por ahora vacío
            estado: 'confirmada',
            enviar_recordatorio: true
        };

        axiosInstance.post('citas/', data)
            .then(res => {
                alert('Cita creada correctamente');
                setShowForm(false);
                setFormData({
                    profesionalId: '',
                    pacienteId: '',
                    motivo_consulta: '',
                    fecha: '',
                    hora_inicio: '',
                    hora_fin: '',
                });
                if (onCitaCreada) {
                    onCitaCreada();
                }
            })
            .catch(err => console.error('Error creando cita:', err));
    };

    // Submit para paciente
    const handleSubmitPaciente = (e) => {
        e.preventDefault();

        axiosInstance.post('pacientes/', formPaciente)
            .then(res => {
                alert('Paciente creado correctamente');
                setShowFormPaciente(false);
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
                // Refrescar la lista de pacientes:
                axiosInstance.get('pacientes/')
                    .then(res => setPacientes(res.data))
                    .catch(err => console.error('Error cargando pacientes:', err));
            })
            .catch(err => console.error('Error creando paciente:', err));
    };

    return (
        <>
            <div className="botones-contenedor">
                <button
                    className="boton-crear-cita"
                    onClick={() => navigate('/dashboard/calendario/agregar-cita')}
                >
                    Crear nueva cita
                </button>
                <button className="boton-crear-cita" onClick={() => setShowFormPaciente(prev => !prev)}>
                    {showFormPaciente ? 'Cerrar formulario' : 'Crear nuevo paciente'}
                </button>
            </div>

            {showForm && (
                <div className="form-overlay">
                    <div className="form-panel">
                        <button
                            type="button"
                            className="close-button"
                            onClick={() => setShowForm(false)}
                        >
                            &times;
                        </button>
                        <h3>Crear nueva cita</h3>
                        <form onSubmit={handleSubmit}>
                            <label>Profesional:</label>
                            <select
                                value={formData.profesionalId}
                                onChange={(e) => setFormData({ ...formData, profesionalId: e.target.value })}
                                required
                            >
                                <option value="">Seleccione un profesional</option>
                                {profesionales.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.usuario.nombre} {p.usuario.apellido}
                                    </option>
                                ))}
                            </select>
                            <label>Paciente:</label>
                            <select
                                value={formData.pacienteId}
                                onChange={(e) => setFormData({ ...formData, pacienteId: e.target.value })}
                                required
                            >
                                <option value="">Seleccione un paciente</option>
                                {pacientes.map(p => (
                                    <option key={p.id} value={p.id}>
                                        {p.nombre} {p.apellido}
                                    </option>
                                ))}
                            </select>

                            <label>Fecha:</label>
                            <input
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                            />

                            <label>Hora inicio:</label>
                            <select
                                value={formData.hora_inicio}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        hora_inicio: e.target.value,
                                        hora_fin: ''  // Limpiar hora fin si cambia inicio
                                    });
                                }}
                                required
                            >
                                {bloques.map(hora => (
                                    <option
                                        key={hora}
                                        value={hora}
                                        disabled={bloquesOcupadosSet.has(hora)}
                                    >
                                        {hora} {bloquesOcupadosSet.has(hora) ? '(Ocupado)' : ''}
                                    </option>
                                ))}
                            </select>

                            <label>Hora fin:</label>
                            <select
                                value={formData.hora_fin}
                                onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                                required
                            >
                                <option value="">Seleccione hora fin</option>
                                {bloquesDisponiblesFin().map(hora => (
                                    <option key={hora} value={hora}>
                                        {hora}
                                    </option>
                                ))}
                            </select>

                            <label>Motivo de consulta:</label>
                            <input
                                type="text"
                                value={formData.motivo_consulta}
                                onChange={(e) => setFormData({ ...formData, motivo_consulta: e.target.value })}
                                required
                            />

                            <div style={{ marginTop: '10px' }}>
                                <button type="submit">Guardar cita</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {showFormPaciente && (
                <div className="form-overlay">
                    <div className="form-panel">
                        <button
                            type="button"
                            className="close-button"
                            onClick={() => setShowFormPaciente(false)}
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