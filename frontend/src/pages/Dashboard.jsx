import React from 'react';
import './Dashboard.css';
import './LogoLayout.css';
import logo from '../assets/tuCita.png'; 
import userIcon from '../assets/user.png'; 
import DashboardLayout from '../Layouts/DashboardLayout';

export default function Dashboard() {
    return (
        <DashboardLayout>
        <section className="content">
            <h2>Contenido principal</h2>
            <h1>ACA TIENEN QUE ESTAR CADA UNO DE LOS APARTADOS COMO EL ANALISIS DEL DASHBOARD; CALENDAR; ETCs</h1>
            {/* Aquí podés colocar el resto del dashboard */}
        </section>
        </DashboardLayout>
    );
}
