import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';

export default function ObservacionesCitas() {

    const { id } = useParams(); // Obtener el ID de la cita desde los parámetros de la URL
    const [cita, setCita] = useState(null);
    const [estadoSeleccionado, setEstadoSeleccionado] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [archivo, setArchivo] = useState(null);
    const [archivos, setArchivos] = useState([]);
    const [descripcion, setDescripcion] = useState('');
    const [tratamientoRecomendado, setTratamientoRecomendado] = useState('');
    const [modoEdicion, setModoEdicion] = useState(false);

    useEffect(() => {
        axiosInstance.get(`/citas/${id}/`)
            .then(response => {
                setCita(response.data);
                setEstadoSeleccionado(response.data.estado);
                setObservaciones(response.data.observaciones || '');

                const pacienteId = response.data.paciente?.id;
                if (pacienteId) {
                    axiosInstance.get(`/archivos/?paciente=${pacienteId}`)
                        .then(res => {
                            const archivosUnicos = res.data.filter((archivo, index, self) =>
                                index === self.findIndex(a => a.archivo_adjunto === archivo.archivo_adjunto)
                            );
                            setArchivos(archivosUnicos);
                        })
                        .catch(err => console.error('Error fetching archivos:', err));
                }
            })
            .catch(error => console.error('Error fetching cita:', error));
    }, [id]);

    
    

        const handleSubmit = (e) => {
            e.preventDefault();

            axiosInstance.patch(`/citas/${id}/`, {
                estado: estadoSeleccionado,
                observaciones: observaciones
            })
            .then(response => {
                alert('Cita actualizada correctamente');
                axiosInstance.get(`/citas/${id}/`)
                .then(res => setCita(res.data))
                .catch(err => console.error('Error recargando cita:', err));
                // Luego vas a querer permitir crear el Diagnóstico
            })
            .catch(err => console.error('Error actualizando cita:', err));
        };

    
        const handleSubmitArchivo = (e) => {
                e.preventDefault();

                if (!archivo) {
                    alert("Seleccioná un archivo antes de subir.");
                    return;
                }

                const formData = new FormData();
                formData.append('paciente', cita.paciente.id);
                formData.append('archivo_adjunto', archivo);

                axiosInstance.post('/archivos/', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                .then(response => {
                    alert('Archivo subido correctamente');
                    setArchivo(null);
                    return axiosInstance.get(`/archivos/?paciente=${cita.paciente.id}`);
                })
                .then(res => setArchivos(res.data))
                .catch(err => console.error('Error subiendo o recargando archivos:', err));
            };

    return (
        <div>
            <h4>Agregar Observaciones a cita de: </h4> {cita && cita.paciente ? (
                <h2>{cita.paciente.nombre} {cita.paciente.apellido}</h2>
            ) : (
                <p>Cargando paciente...</p>
            )}
            {cita ? (
                <div>
                    
                    <p><strong>Fecha:</strong> {new Date(cita.fecha).toLocaleDateString()}</p>
                    <p><strong>Hora:</strong> {cita.hora_inicio} - {cita.hora_fin}</p>
                    <p><strong>Motivo de la cita:</strong> {cita.motivo_consulta}</p>
                    <p><strong>Profesional:</strong> {cita.profesional.usuario.nombre} {cita.profesional.usuario.apellido}</p>
                    
                    {cita.diagnostico && (
                        <>
                            <h5>Diagnóstico registrado:</h5>
                            <p><strong>Descripción:</strong> {cita.diagnostico?.descripcion}</p>
                            <p><strong>Tratamiento recomendado:</strong> {cita.diagnostico?.tratamiento_recomendado}</p>
                        </>
                    )}
                    
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            axiosInstance.patch(`/citas/${id}/`, { estado: estadoSeleccionado })
                                .then(() => {
                                    alert('Estado actualizado correctamente');
                                    setModoEdicion(false);
                                    axiosInstance.get(`/citas/${id}/`)
                                        .then(res => setCita(res.data))
                                        .catch(err => console.error('Error recargando cita:', err));
                                })
                                .catch(err => console.error('Error actualizando estado:', err));
                        }}
                    >
                        <div className="mb-3">
                            <label htmlFor="estado" className="form-label">Estado de la cita</label>
                            <select
                                className="form-control"
                                id="estado"
                                value={estadoSeleccionado}
                                onChange={(e) => setEstadoSeleccionado(e.target.value)}
                            >
                                <option value="pendiente">Pendiente</option>
                                <option value="confirmada">Confirmada</option>
                                <option value="cancelada">Cancelada</option>
                                <option value="no_asistida">No asistida</option>
                                <option value="completada">Completada</option>
                            </select>
                        </div>
                        <button type="submit" className="btn btn-warning">Actualizar estado</button>
                    </form>
                    
                </div>

                
            ) : (
                <p>Cargando cita...</p>
            )}
            <hr />
            {!observaciones || modoEdicion ? (
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label htmlFor="observaciones" className="form-label">Observaciones</label>
                        <textarea
                            className="form-control"
                            id="observaciones"
                            rows="3"
                            value={observaciones}
                            onChange={(e) => setObservaciones(e.target.value)}
                        ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary">Guardar</button>
                </form>
            ) : (
                <div>
                    <h5>Observaciones anteriores:</h5>
                    <p>{observaciones}</p>
                    <button onClick={() => setModoEdicion(true)} className="btn btn-secondary">Editar</button>
                </div>
            )}
            
            <hr />
            

            <hr />
            {cita?.paciente?.id && (
                <div>
                    <h5>Archivos clínicos:</h5>
                    {archivos.length > 0 ? (
                        <ul>
                            {archivos.map(archivo => (
                                <li key={archivo.id}>
                                    <a href={archivo.archivo_adjunto} target="_blank" rel="noopener noreferrer">
                                        {archivo.archivo_adjunto.split('/').pop()}
                                    </a>
                                    {archivo.descripcion && (
                                        <p><em>{archivo.descripcion}</em></p>
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No hay archivos.</p>
                    )}

                    {/* Mostrar formulario para subir más archivos */}
                    <form onSubmit={handleSubmitArchivo}>
                        <label htmlFor="archivo" className="form-label">Archivo</label>
                        <input
                            type="file"
                            onChange={(e) => setArchivo(e.target.files[0])}
                        />
                        <button type="submit">Subir Archivo</button>
                    </form>
                </div>
            )}
            <hr />

    
        </div>
    );
}
