import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
    {
        diagnostico: 'Caries',
        mesActual: 25,
        mesAnterior: 20,
        porcentaje: '45%',
        color: '#0b3f1c'
    },
    {
        diagnostico: 'Blanqueamientos',
        mesActual: 23,
        mesAnterior: 18,
        porcentaje: '30%',
        color: '#15803d'
    },
    {
        diagnostico: 'Limpieza Dent',
        mesActual: 12,
        mesAnterior: 10,
        porcentaje: '15%',
        color: '#4ade80'
    },
    {
        diagnostico: 'Arreglos',
        mesActual: 6,
        mesAnterior: 15,
        porcentaje: '10%',
        color: '#86efac'
    }
];

export default function GraficoAtencion() {
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
                <ResponsiveContainer width="100%" height={220}>
                <BarChart data={data} barGap={6}>
                    <XAxis dataKey="diagnostico" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="mesAnterior" fill="#6b7280" name="Mes antes" />
                    <Bar dataKey="mesActual" fill="#3c9c6e" name="Mes actual" />
                </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
