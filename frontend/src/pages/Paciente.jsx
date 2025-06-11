import React from 'react';
import './Paciente.css'
import { FaUserPlus, FaUserEdit, FaCalendarPlus, FaClipboardList } from 'react-icons/fa';

export default function Paciente() {
    
    return(
        <div className="agregar-cita-container">
            <aside className="panel-izquierdo">
                <h6>Lista de pacientes</h6>
                <ul>
                    <li>Hola</li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                    <li></li>
                </ul>
            </aside>
            <main className="panel-derecho">

                <div className="row ">
                    <div className='container-btn'>
                        <button> <FaUserPlus color="#1976d2" /> Crear paciente</button>
                        <button><FaUserEdit color="#388e3c" /> Editar datos</button>
                        <button><FaCalendarPlus color="#fbc02d" /> Nueva cita</button>
                        <button><FaClipboardList color="#d32f2f" /> Observaciones</button>
                    </div>
                </div>

                <div className="contenedor">
                    <div className="row ">
                        <div className="paciente">
                            <h3>Ana Tolola</h3>
                        </div>
                        {/* Tabla de datos personales */}
                        <div className="datos-personales">
                            <h4>Datos personales</h4>
                            <table>
                                <thead>
                                    <tr>
                                    <th>Edad</th>
                                    <th>Fehca de nacimiento</th>
                                    <th>Teléfono</th>
                                    <th>Correo</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <td>34 años</td>
                                    <td>10 de marzo de 1980</td>
                                    <td>123-458-98</td>
                                    <td>anatolola@gmail.com</td>
                                </tbody>
                            </table>
                        </div>
                    </div>
                        <br />
                    <div className="row ">
                        {/* Tabla de citas*/}
                        <div className=" datos-personales">
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
                                                <tr>
                                                    <td>15/05/2025</td>
                                                    <td>Totok Mireia</td>
                                                    <td>Caries en pieza 24</td>
                                                    <td>Sensibilidad en pieza 34</td>
                                                </tr>
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
                                                <tr>
                                                    <td>15/05/2025</td>
                                                    <td>radiografia.jpg</td>
                                                </tr>
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
                            <span>Cantidad de visitas</span>
                            <h1>5</h1>
                        </div>
                        <div className="card info-clinica">
                            <span>Información clínica</span>
                            <h2>Ultimo diagnóstico: </h2>
                            <span>Caries......</span>
                        </div>
                        <div className="card info-clinica">
                            <div className="info-clinica-columns">
                                <div className="info-col">
                                    <span>Enfermedades previas:</span>
                                    <h2>Gengivitis</h2>
                                </div>
                                <div className="info-col">
                                    <span>Alergias:</span>
                                    <h2>Penicilina</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

