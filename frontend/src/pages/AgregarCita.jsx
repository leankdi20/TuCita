import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import './AgregarCita.css';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCalendarAlt, FaTooth, FaThumbtack } from 'react-icons/fa';

export default function AgregarCita() {
    const navigate = useNavigate();

    const [pacientes, setPacientes] = useState([]);
    const [profesionales, setProfesionales] = useState([]);
    const bloques = [
        '08:00', '08:30', '09:00', '09:30',
        '10:00', '10:30', '11:00', '11:30',
        '12:00', '12:30', '13:00', '13:30',
        '14:00', '14:30', '15:00', '15:30',
        '16:00', '16:30', '17:00', '17:30',
        '18:00', '18:30', '19:00', '19:30',
        '20:00', '20:30', '21:00', '21:30',
        '22:00',
    ];
    const [formData, setFormData] = useState({
        pacienteId: '',
        profesionalId: '',
        motivo_consulta: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
    });
    const [bloquesOcupadosSet, setBloquesOcupadosSet] = useState(new Set());
    const [bloquesInicioCita, setBloquesInicioCita] = useState(new Set());
    const [citasDia, setCitasDia] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [ultimaCitaPaciente, setUltimaCitaPaciente] = useState(null);
  

    const motivos = [
            "Caries",
            "Consulta general",
            "Limpieza dental",
            "Endodoncia",
            "Extracción dental",
            "Atención de urgencia",
            "Blanqueamiento dental",
            "Ortodoncia",
            "Prótesis dental",
            "Consulta por dolor",
            "Control de tratamiento",
            "Consulta pediátrica",
            "Consulta estética",
        ];


    const bloquesDisponiblesFin = () => {
        const indexInicio = bloques.indexOf(formData.hora_inicio);
        if (indexInicio === -1) return [];

        const disponibles = [];

        for (let i = indexInicio + 1; i < bloques.length; i++) {
            const bloque = bloques[i];
            if (bloquesInicioCita.has(bloque)) {
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
                setCitasDia(res.data);
                const ocupadasSet = new Set();
                const inicioCitas = new Set();

                res.data.forEach(cita => {
                    const inicio = cita.hora_inicio.slice(0, 5);
                    const fin = cita.hora_fin.slice(0, 5);

                    const inicioIndex = bloques.indexOf(inicio);
                    const finIndex = bloques.indexOf(fin);

                    for (let i = inicioIndex; i < finIndex; i++) {
                        if (i >= 0 && i < bloques.length) {
                            ocupadasSet.add(bloques[i]);
                        }
                    }

                    if (inicioIndex >= 0 && inicioIndex < bloques.length) {
                        inicioCitas.add(bloques[inicioIndex]);
                    }
                });

                setBloquesOcupadosSet(ocupadasSet);
                setBloquesInicioCita(inicioCitas);
            })
            .catch(err => console.error('Error cargando citas del día:', err));
        } else {
            setBloquesOcupadosSet(new Set());
            setCitasDia([]);
        }
    }, [formData.profesionalId, formData.fecha]);

    useEffect(() => {
        if (formData.pacienteId) {
            axiosInstance.get(`pacientes/${formData.pacienteId}/`)
                .then(res => {
                    setPacienteSeleccionado(res.data);

                    // obtener última cita:
                    axiosInstance.get('citas/', {
                        params: {
                            paciente: formData.pacienteId,
                            ordering: '-fecha'
                        }
                    }).then(r => {
                        if (r.data.length > 0) {
                            setUltimaCitaPaciente(r.data[0]);
                        } else {
                            setUltimaCitaPaciente(null);
                        }
                    });
                })
                .catch(err => console.error('Error cargando paciente:', err));
        } else {
            setPacienteSeleccionado(null);
            setUltimaCitaPaciente(null);
        }
    }, [formData.pacienteId]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const data = {
            paciente: formData.pacienteId,
            profesional: formData.profesionalId,
            motivo_consulta: formData.motivo_consulta,
            fecha: `${formData.fecha}T${formData.hora_inicio}:00`,
            hora_inicio: `${formData.hora_inicio}:00`,
            hora_fin: `${formData.hora_fin}:00`,
            observaciones: '',
            estado: 'confirmada',
            enviar_recordatorio: true
        };

        axiosInstance.post('citas/', data)
            .then(() => {
                alert('Cita creada correctamente');
                navigate('/dashboard/calendario');
            })
            .catch(err => console.error('Error creando cita:', err));
    };

    return (
        <div className="agregar-cita-container">
            {/* Panel izquierdo */}
            <aside className="panel-izquierdo">
                <h6>Panel de citas/ Pacientes</h6>
                <p className="texto-ayuda">* Completá el formulario para agendar la cita</p>

                {pacienteSeleccionado && (
                    <div className="paciente-info">
                        <h4><FaUser style={{ marginRight: '6px', color: '#6A0DAD' }} />
                            {pacienteSeleccionado.nombre} {pacienteSeleccionado.apellido}</h4>
                        <p> <FaCalendarAlt style={{ marginRight: '6px', color: '#3498db' }} />
                            <strong>Última cita:</strong> {ultimaCitaPaciente ? ultimaCitaPaciente.fecha.split('T')[0] : 'Sin datos'}</p>
                        <p><FaTooth style={{ marginRight: '6px', color: '#c0392b' }} />
                            <strong>Diagnóstico:</strong> {pacienteSeleccionado.ultimo_diagnostico || '-'}</p>
                        <p><FaThumbtack style={{ marginRight: '6px', color: '#e74c3c' }} />
                            <strong>Observación:</strong> {pacienteSeleccionado.observaciones_clinicas || '-'}</p>
                    </div>
                )}

                <div className="citas-agendadas">
                    <h4>Citas agendadas {formData.fecha ? formData.fecha.split('-').reverse().join('/') : ''}:</h4>
                    <ul>
                        {citasDia.map(c => (
                            <li key={c.id}>
                                {c.hora_inicio.slice(0, 5)} - {c.hora_fin.slice(0, 5)} {c.paciente.nombre} {c.paciente.apellido}
                            </li>
                        ))}
                    </ul>
                </div>

                {formData.profesionalId && formData.fecha && (
                    <div className="disponibilidad">
                        <h4>
                            {profesionales.find(p => p.id === parseInt(formData.profesionalId))?.usuario.nombre} - {formData.fecha.split('-').reverse().join('/')}
                        </h4>
                        <p className="disponible">🟢 Disponible:</p>
                        <ul>
                            {bloques.map((bloque, i) => {
                                const index = bloques.indexOf(bloque);
                                const siguienteBloque = bloques[index + 1];

                                if (!bloquesOcupadosSet.has(bloque) && siguienteBloque && !bloquesOcupadosSet.has(siguienteBloque)) {
                                    return (
                                        <li key={bloque}>
                                            {bloque} - {siguienteBloque}
                                        </li>
                                    );
                                }
                                return null;
                            })}
                        </ul>
                    </div>
                )}
            </aside>

            {/* Formulario derecho */}
            <main className="panel-derecho">
                <h2>Nueva cita</h2>
                <form className="form-agregar-cita" onSubmit={handleSubmit}>
                    <div className="fila-form">
                        <div className="campo-form">
                            <label>Profesional</label>
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
                        </div>
                        <div className="campo-form">
                            <label>Fecha</label>
                            <input
                                type="date"
                                value={formData.fecha}
                                onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="fila-form">
                        <div className="campo-form">
                            <label>Paciente</label>
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
                        </div>
                        <div className="campo-form">
                            <label>Hora inicio</label>
                            <select
                                value={formData.hora_inicio}
                                onChange={(e) => {
                                    setFormData({
                                        ...formData,
                                        hora_inicio: e.target.value,
                                        hora_fin: ''
                                    });
                                }}
                                required
                            >
                                <option value="">Seleccione hora inicio</option>
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
                        </div>
                    </div>

                    <div className="fila-form">
                        <div className="campo-form">
                            <label>Hora fin</label>
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
                        </div>
                        <div className="campo-form">
                            <label>Motivo / Atención</label>
                            <select
                                value={formData.motivo_consulta}
                                onChange={(e) =>
                                    setFormData({ ...formData, motivo_consulta: e.target.value })
                                }
                                required
                            >
                                <option value="">Seleccione un motivo</option>
                                {motivos.map((motivo, i) => (
                                    <option key={i} value={motivo}>
                                        {motivo}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="fila-form">
                        <div className="campo-form">
                            <label>Adjuntar archivo <span className="opcional">(opcional)</span></label>
                            <input type="file" />
                        </div>
                    </div>

                    <div className="botones-form">
                        <button type="submit" className="btn-agregar">Agregar cita</button>
                        <button
                            type="button"
                            className="btn-cancelar"
                            onClick={() => navigate('/dashboard/calendario')}
                        >
                            Cancelar
                        </button>
                    </div>

                    <div className="recordatorio">
                        <label><input type="checkbox" /> Enviar recordatorio por email</label><br />
                        <label><input type="checkbox" /> Enviar recordatorio por WhatsApp</label>
                    </div>
                </form>
            </main>
        </div>
    );
}
