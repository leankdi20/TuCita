import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';


import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

import logo from '../assets/tuCita.png';

import imgdashboardV from '../assets/imgdashboardV.png';
import imgdashboardG from '../assets/imgdashboardG.png';
import imgcalendarioG from '../assets/calendario_gris.png';
import imgcalendarioV from '../assets/calendario_verde.png';
import imgequipoG from '../assets/equipoG.png';
import imgequipoV from '../assets/equipoV.png';
import imgpacienteG from '../assets/pacienteG.png';
import imgpacienteV from '../assets/pacienteV.png';

export default function DashboardLayout({ children }) {
    const [active, setActive] = useState('dashboard');
    const navigate = useNavigate();

    const handleLogout = () => {
        //Borramos el usuario o el token que deja entrar al dashboard
        localStorage.removeItem('user');
        //Redirijo al login sin dejar volver atras
        navigate('/', {replace: true});
    };

    useEffect(() => {
    const user = localStorage.getItem('user');
    if (!user) {
        navigate('/', { replace: true });
    }
    }, []);

    return (
        <div className="dashboard-layout">
            
            <aside className="sidebar">
                <div className='img-cita'>
                    <img src={logo} alt="Logo tuCitas" className="logo" />
                </div>
                
                <div className="title-menu">
                    <h4>MENÚ</h4>
                </div>
                
                <nav className="nav-links">
                    <span
                    className={`nav-item ${active === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActive('dashboard')}
                    >
                    <span className="nav-indicator"></span>
                    <img
                        src={active === 'dashboard' ? imgdashboardV : imgdashboardG}
                        alt="Dashboard"
                        className="nav-icon"
                    />
                    <Link to="/dashboard">Dashboard</Link>
                    </span>

                    <span
                    className={`nav-item ${active === 'calendario' ? 'active' : ''}`}
                    onClick={() => setActive('calendario')}
                    >
                    <span className="nav-indicator"></span>
                    <img
                        src={active === 'calendario' ? imgcalendarioV : imgcalendarioG}
                        alt="Calendario"
                        className="nav-icon"
                    />
                    <Link to="/dashboard/calendario" className="nav-text">Calendario</Link>
                    </span>

                    <span
                    className={`nav-item ${active === 'equipo' ? 'active' : ''}`}
                    onClick={() => setActive('equipo')}
                    >
                    <span className="nav-indicator"></span>
                    <img
                        src={active === 'equipo' ? imgequipoV : imgequipoG}
                        alt="Equipo"
                        className="nav-icon"
                    />
                    <Link to="/dashboard/equipo" className="nav-text">Equipo</Link>
                    </span>

                    <span
                    className={`nav-item ${active === 'paciente' ? 'active' : ''}`}
                    onClick={() => setActive('paciente')}
                    >
                    <span className="nav-indicator"></span>
                    <img
                        src={active === 'paciente' ? imgpacienteV : imgpacienteG}
                        alt="Paciente"
                        className="nav-icon"
                    />
                    <Link to="/dashboard/paciente" className="nav-text">Paciente</Link>
                    </span>
                    </nav>
                    <button className='btn-cierre-sesion' onClick={handleLogout}>
                        Cerrar sesión
                    </button>
            </aside>

            <div className="main-area">
                <Navbar />

                        {/* Acá el área dinámica pero siempre dentro del mismo diseño */}
                <section className="content">
                    <Outlet />
                </section>

                <Footer />
            </div>
        </div>
        );
    }
