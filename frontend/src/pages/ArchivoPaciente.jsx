import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export default function ArchivosPacientes() {
    const { idPaciente } = useParams();
    const navigate = useNavigate();
    const [archivos, setArchivos] = useState([]);

    useEffect(() => {
        setArchivos([]);
        if (!idPaciente) return;

        axiosInstance.get(`/archivos/?paciente=${idPaciente}`)
            .then(response => {
                const archivosUnicos = response.data.filter(
                    (archivo, index, self) =>
                        index === self.findIndex(a => a.archivo_adjunto === archivo.archivo_adjunto)
                );
                setArchivos(archivosUnicos);
            })
            .catch(error => {
                console.error("Error al traer los archivos del paciente:", error);
                setArchivos([]);
            });
    }, [idPaciente]);

    const obtenerNombreArchivo = (url) => {
        if (!url) return '';
        return url.split('/').pop();
    };

    return (
        <div>
            <h2>Archivos del paciente {idPaciente}</h2>

            <ul>
                {archivos.length > 0 ? (
                    archivos.map((archivo, index) => (
                        <li key={index}>
                            <a href={archivo.archivo_adjunto} target="_blank" rel="noopener noreferrer">
                                {obtenerNombreArchivo(archivo.archivo_adjunto)}
                            </a>
                            {archivo.descripcion && (
                                <p><em>{archivo.descripcion}</em></p>
                            )}
                        </li>
                    ))
                ) : (
                    <p>No hay archivos para este paciente.</p>
                )}
            </ul>

            {/* 🔙 Botón para volver */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    marginTop: '20px',
                    backgroundColor: '#1976d2',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                }}
            >
                ← Volver
            </button>
        </div>
    );
}
