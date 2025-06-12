
import React, { useState, useEffect,useRef  } from 'react';
import './Paciente.css'
import {FaCog, FaUserPlus, FaUserEdit, FaCalendarPlus, FaClipboardList } from 'react-icons/fa';
import axiosInstance from '../api/axiosInstance';
import { HiUserCircle } from "react-icons/hi2";
import { FaRegImage } from 'react-icons/fa';

import BotonesPaciente from '../components/BotonesPaciente';

function formatFecha(fechaString) {
    if (!fechaString) return '';  // protección extra por si llega vacío
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

export default function Paciente() {

    const [pacientes, setPacientes] = useState([]);
    const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null);
    const [citasPaciente, setCitasPaciente] = useState([]);
    const pacienteActual = pacientes.find(p => p.id === pacienteSeleccionado);
    const [archivosPaciente, setArchivosPaciente] = useState([]);
    const [menuOpen, setMenuOpen] = useState(false);
    const dropdownRef = useRef(null);
    const ultimaCitaOrdenada = citasPaciente.length > 0 
    ? [...citasPaciente].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))[0] 
    : null;

    const cantidadCitas = citasPaciente.length;
    const enfermedadesYAlergias = pacienteActual ;
    

    const [abrirFormularioPaciente, setAbrirFormularioPaciente] = useState(false);
    
    const refrescarPacientes = () => {
        axiosInstance.get('/pacientes/')
            .then(response => {
                setPacientes(response.data);
            })
            .catch(error => {
                console.error("Error al traer los datos pacientes:", error);
                setPacientes([]);
            });
    };

    useEffect(() => {
        axiosInstance.get('/pacientes/')
        .then(response => {
            setPacientes(response.data);
        })
        .catch(error => {
            console.error("Error al traer los datos pacientes:", error);
            setPacientes([]); // En caso de error, se asegura que pacientes sea un array vacío
        })


        const handleClickOutside = (event) => {
                if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                    setMenuOpen(false);
                }
            };

            document.addEventListener('mousedown', handleClickOutside);

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };

    }, []);

    
    
    return(
        <div className="agregar-cita-container">
            <aside className="panel-izquierdo">
                <h6>Lista de pacientes</h6>
                <ul>
                    {pacientes.map(paciente =>(
                        <li key={paciente.id}><HiUserCircle color="green" 
                        onClick={() => {
                                setPacienteSeleccionado(paciente.id);

                                // además traés las citas de este paciente:
                                axiosInstance.get('/citas/', { params: { paciente: paciente.id } })
                                    .then(response => setCitasPaciente(response.data))
                                    .catch(error => {
                                        console.error("Error al traer citas del paciente:", error);
                                        setCitasPaciente([]);
                                });
                                axiosInstance.get('/archivos/')
                                    .then(response => {
                                        const archivosFiltrados = response.data.filter(archivo => 
                                            archivo.diagnostico.cita.paciente.id === paciente.id
                                        );
                                        setArchivosPaciente(archivosFiltrados);
                                    })
                                    .catch(error => {
                                        console.error("Error al traer archivos del paciente:", error);
                                        setArchivosPaciente([]);
                                });
                            }}
                        style={{ cursor: 'pointer' }}  

                        /> 
                            {paciente.nombre} {paciente.apellido}
                        </li>
                    ))}
                </ul>
            </aside>


            <main className="panel-derecho">

                <div className="dropdown-ajustes" ref={dropdownRef}>
                    <button className="dropdown-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        <FaCog size={28} />
                    </button>

                    <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
                        <div className="dropdown-item" onClick={() => { 
                            setMenuOpen(false); 
                            setAbrirFormularioPaciente(true);  // 👉 abrimos el formulario
                        }}>
                            <FaUserPlus color="#1976d2" /> Crear paciente
                        </div>
                        <div className="dropdown-item" onClick={() => { setMenuOpen(false); alert('Editar datos'); }}>
                            <FaUserEdit color="#388e3c" /> Editar datos
                        </div>
                        <div className="dropdown-item" onClick={() => { setMenuOpen(false); alert('Nueva cita'); }}>
                            <FaCalendarPlus color="#fbc02d" /> Nueva cita
                        </div>
                        <div className="dropdown-item" onClick={() => { setMenuOpen(false); alert('Observaciones'); }}>
                            <FaClipboardList color="#d32f2f" /> Observaciones
                        </div>
                    </div>
                </div>

                <div className="contenedor">
                    <div className="row ">
                        <div className="paciente">
                            <h3>{pacienteActual ? `${pacienteActual.nombre} ${pacienteActual.apellido}`: 'Seleccione un paciente' }</h3>
                        </div>
                        {/* Tabla de datos personales */}
                            
                            <div className="datos-personales">
                                <h4>Datos personales</h4>
                                {pacienteActual ? (
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Edad</th>
                                                <th>Cédula</th>
                                                <th>Teléfono</th>
                                                <th>Correo</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{pacienteActual.edad} años</td>
                                                <td>{pacienteActual.cedula}</td>
                                                <td>{pacienteActual.telefono}</td>
                                                <td>{pacienteActual.correo}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                ) : (
                                    <p style={{ padding: '10px', color: '#666' }}>
                                        Seleccione un paciente para ver sus datos personales.
                                    </p>
                                )}
                            </div>
                    </div>
                        <br />
                    <div className="row ">
                        {/* Tabla de citas*/}
                        
                        <div className=" datos-personales citas-anteriores">
                            <div className="row">
                                <div className="col-9 ">
                                    <div className="">
                                        <h4>Citas anteriores</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                <th>Fecha</th>
                                                <th>Profesional</th>
                                                <th>Atención</th>
                                                <th>Observación</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {citasPaciente.map(cita => (
                                                    <tr key={cita.id}>
                                                    <td>{formatFecha(cita.fecha)}</td>
                                                    <td>{cita.profesional.usuario.nombre} {cita.profesional.usuario.apellido}</td>
                                                    <td>{cita.motivo_consulta}</td>
                                                    <td>{cita.observaciones}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="col-3 ">
                                    <div className="">
                                        <h4>Archivos</h4>
                                        <table>
                                            <thead>
                                                <tr>
                                                    <th>Fecha</th>
                                                    <th>Documento</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {archivosPaciente.length > 0 ? (
                                                    archivosPaciente.map(archivo => (
                                                        <tr key={archivo.id}>
                                                            <td>{formatFecha(archivo.diagnostico.fecha_diagnostico)}</td>
                                                            <td>
                                                                <a href={archivo.archivo_adjunto} target="_blank" rel="noopener noreferrer">
                                                                    <FaRegImage color="#1976d2" /> {archivo.archivo_adjunto.split('/').pop()}
                                                                </a>
                                                            </td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="2" style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                                                            No hay archivos para este paciente.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    
                    </div>
                    <br />
                    
                    <div className="row-cards">
                        <div className="card cantidad-citas">
                            {cantidadCitas > 0 ? (
                                <>
                                <span>Cantidad de citas</span>
                                <h1>{cantidadCitas}</h1>
                                </>
                            ) : (
                                <span>No hay citas registradas</span>
                            )}
                            
                        </div>
                        <div className="card info-clinica">
                            
                        
                            <h5>Ultimo motivo de consulta: </h5>
                            {ultimaCitaOrdenada ? (
                                
                                <h3>{ultimaCitaOrdenada.motivo_consulta}</h3>
                            ) : (
                                <p>No hay citas registradas.</p>
                            )}
                            
                        </div>
                        <div className="card info-clinica">
                            <div className="">
                                <div className="">
                                    {enfermedadesYAlergias ? (
                                        <>
                                            <span>Enfermedades previas:</span>
                                            <h4>{enfermedadesYAlergias.enfermedades_previas || 'Ninguna'}</h4>
                                        </>
                                    ) : (
                                        <span>Seleccione un paciente para ver sus enfermedades previas.</span>
                                    )}
                                </div>
                                <div className="">
                                    {enfermedadesYAlergias ?(
                                        <>  
                                            <span>Alergias:</span>
                                            <h4>{enfermedadesYAlergias.alergias || 'Ninguna'}</h4>
                                        </>
                                    ):(
                                        <span>Seleccione un paciente para ver sus alergias.</span>
                                    )}
                                    
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <BotonesPaciente
                    abrir={abrirFormularioPaciente}
                    onClose={() => setAbrirFormularioPaciente(false)}
                    onPacienteCreado={refrescarPacientes}
                />
            </main>
        </div>
    );
}

