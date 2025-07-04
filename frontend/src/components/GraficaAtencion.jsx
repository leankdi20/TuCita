import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import React, { useEffect, useState } from "react";
import axiosInstance from '../api/axiosInstance';

export default function GraficoAtencion() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/grafico-atencion/');
                if (Array.isArray(response.data)) {
                    
                    // Asegurarse de que los datos numéricos estén correctamente parseados
                    const parsedData = response.data.map(item => ({
                        ...item,
                        mesActual: Number(item.mesActual),
                        mesAnterior: Number(item.mesAnterior)
                    }));
                    setData(parsedData);
                } else {
                    console.error("El backend no devolvió una lista.");
                }
            } catch (error) {
                console.error('Error al cargar datos de la gráfica de atención:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="d-flex">
            {/* Leyenda a la izquierda */}
            <div className="me-4">
                <h5>Gráfica de atención</h5>
                <ul className="list-unstyled">
                    {data.map((item, index) => (
                        <li key={index} className="d-flex align-items-center mb-2">
                            <span
                                style={{
                                    backgroundColor: item.color,
                                    display: 'inline-block',
                                    width: '20px',
                                    height: '20px',
                                    borderRadius: '4px',
                                    marginRight: '8px'
                                }}
                            ></span>
                            <span style={{ color: '#6c757d', fontWeight: '500' }}>
                                {item.diagnostico} - {item.porcentaje}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Gráfico */}
            <div style={{ flex: 1 }}>
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={data} barGap={6}>
                        <XAxis dataKey="diagnostico" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="mesAnterior" fill="#6b7280" name="Mes anterior" />
                        <Bar dataKey="mesActual" fill="#3c9c6e" name="Mes actual" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
