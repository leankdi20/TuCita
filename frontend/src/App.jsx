import { useState } from 'react';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import Dashboard from './pages/Dashboard'; 
import AnaliticDash from './pages/AnaliticDashboard'
import DashboardLayout from './Layouts/DashboardLayout';
import Calendario from './pages/Calendario'
import Equipo from './pages/Equipo'
import Paciente from './pages/Paciente'
import AgregarCita from './pages/AgregarCita';



function App() {
  console.log('App cargado')
  return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/recuperar" element={<Recuperar />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<AnaliticDash />} /> {/* /dashboard */}
          <Route path="calendario" element={<Calendario />} /> 
          <Route path="/dashboard/calendario/agregar-cita" element={<AgregarCita />} />
          <Route path="equipo" element={<Equipo />} /> 
          <Route path="paciente" element={<Paciente />} /> 
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

