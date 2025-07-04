import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import dayjs from "dayjs";

const UltimosPacientesAtendidosCard = () => {
    const [pacientes, setPacientes] = useState([]);

    useEffect(() => {
        const fetchPacientes = async () => {
        try {
            const response = await axiosInstance.get('/api/ultimos-pacientes-atendidos/');
            setPacientes(response.data);
        } catch (error) {
            console.error('Error al cargar últimos pacientes:', error);
        }
        };

        fetchPacientes();
    }, []);

    return (
        <div className="col-md-6">
            <div className="card color-fondo-card-amarillo shadow-sm h-100">
                <div className="card-body">
                <h6 className="fw-bold mb-3">Últimos pacientes atendidos</h6>
                <div className="table-responsive">
                    <table className="table table-borderless table-sm mb-0 table-transparent">
                    <thead className="text-muted">
                        <tr>
                        <th>Paciente</th>
                        <th>Fecha</th>
                        <th>Diagnóstico</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pacientes.length === 0 ? (
                        <tr>
                            <td colSpan="3" className="text-center">No hay registros</td>
                        </tr>
                        ) : (
                        pacientes.map((p, index) => (
                            <tr key={index}>
                            <td>{p.paciente_nombre}</td>
                            <td>{p.fecha}</td>
                            <td>{p.motivo_consulta}</td>
                            </tr>
                        ))
                        )}
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    );
};

export default UltimosPacientesAtendidosCard;