import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const IndicadoresPacientesCard = () => {
    const [indicadores, setIndicadores] = useState({
        activos: 0,
        nuevos_mes: 0,
        citas_pendientes: 0,
    });

    const fetchIndicadores = async () => {
        try {
        const response = await axiosInstance.get("/api/indicadores-pacientes/");
        setIndicadores(response.data);
        } catch (error) {
        console.error("Error al cargar los indicadores:", error);
        }
    };

    useEffect(() => {
        fetchIndicadores();
    }, []);

    return (
        <div className="col-md-6">
        <div className="card card-gradient-verde text-white shadow-sm h-100">
            <div className="card-body">
            <h6 className="fw-bold mb-3">Indicadores de pacientes</h6>
            <div className="tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                <span>Pacientes activos</span>
                <span>{indicadores.activos}</span>
            </div>
            <div className="tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                <span>Nuevos este mes</span>
                <span>{indicadores.nuevos_mes}</span>
            </div>
            <div className="tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                <span>Citas de seguimiento</span>
                <span>{indicadores.citas_pendientes}</span>
            </div>
            </div>
        </div>
        </div>
    );
};

export default IndicadoresPacientesCard;