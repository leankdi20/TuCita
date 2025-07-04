// src/components/CitasPorSemanaChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import axiosInstance from '../api/axiosInstance';
import React, { useState, useEffect,useRef } from 'react';

// const data = [
//     { day: 'L', citas: 10 },
//     { day: 'M', citas: 3 },
//     { day: 'X', citas: 4 },
//     { day: 'J', citas: 2 },
//     { day: 'V', citas: 6 },
//     { day: 'S', citas: 15 },
//     { day: 'D', citas: 5 }
// ];

export default function CitasPorSemanaChart() {

    const [data, setData] = useState([]);

    useEffect(() => {
        axiosInstance.get('/citas/')
        .then(response => {
            const hoy = new Date();
            const primerDiaSemana = new Date(hoy);
            primerDiaSemana.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)); // lunes
            primerDiaSemana.setHours(0, 0, 0, 0);

            const ultimoDiaSemana = new Date(primerDiaSemana);
            ultimoDiaSemana.setDate(primerDiaSemana.getDate() + 6); // domingo
            ultimoDiaSemana.setHours(23, 59, 59, 999);
            
            const citasSemana = response.data.filter(cita => {
                const fecha = new Date(cita.fecha);
                return fecha >= primerDiaSemana && fecha <= ultimoDiaSemana;
            });

            const dias = ['D','L', 'M', 'X', 'J', 'V', 'S',];
            const conteo = { D: 0, L: 0, M: 0, X: 0, J: 0, V: 0, S: 0 };

            citasSemana.forEach(cita => {
                const fecha = new Date(cita.fecha);
                const dia = dias[fecha.getDay()];
                conteo[dia]++;
            });

            const datos = dias.map(d => ({ day: d, citas: conteo[d] }));
            setData(datos);
        })
        .catch(error => {
            console.error('Error al obtener citas:', error);
        });
    }, []);


    return (
        <ResponsiveContainer width="90%" height={150}>
            <BarChart data={data}>
                <XAxis dataKey="day" />
                <YAxis domain={[0, 'dataMax + 1']} />
                <Tooltip />
                <Bar dataKey="citas" fill="#3c9c6e" radius={[10, 10, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}
