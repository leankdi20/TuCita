// src/components/CitasPorSemanaChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { day: 'L', citas: 10 },
    { day: 'M', citas: 3 },
    { day: 'X', citas: 4 },
    { day: 'J', citas: 2 },
    { day: 'V', citas: 6 },
    { day: 'S', citas: 15 },
    { day: 'D', citas: 5 }
];

export default function CitasPorSemanaChart() {
    return (
        <ResponsiveContainer width="90%" height={150} >
        <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis domain={[0, 'dataMax + 1']} />
            <Tooltip />
            <Bar dataKey="citas" fill="#3c9c6e" radius={[10, 10, 0, 0]} />
        </BarChart>
        </ResponsiveContainer>
    );
}
