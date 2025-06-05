import React from 'react';
import './AnaliticDashboard.css'
import CitasPorSemanaChart from '../components/CitasPorSemanaChart';


export default function AnaliticDashboard() {
    return(
        <>
            <h3>Dashboard Analítico</h3>
            {/* Primera fila */}
            <div className="row g-3 ">
                <div className="row g-3">
                    {/* Card 1 */}
                    <div className="col-md-3">
                        <div className="card bg-success card-gradient-verde text-white  shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Total pacientes</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="mt-3">24</h1>
                            <p className="mt-2">↑ Incremento desde el mes pasado</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="col-md-3 ">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas para hoy</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="mt-3">12</h1>
                            <p className="mt-2">↑ Más que ayer</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold  shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas sin confirmar</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="mt-3">5</h1>
                            <p className="mt-2">↓ Menos que la semana pasada</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo  color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas canceladas</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="mt-3">8</h1>
                            <p className="mt-2">⏳ A la espera de confirmación</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Segunda y tercera fila */}
            <div className="row g-3">
                <div className="row g-3 align-items-stretch">


                    {/* Recordatorio */}
                    <div className="col-md-2">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <h6 className="fw-bold">Cita con María Llamas Echeverría</h6>
                            <p>Hora: 2:00 pm - 3:00 pm<br/>Último diagnóstico: Bruxismo<br/>Última visita: 05-01-25</p>
                            <a href="#" className="btn card-gradient-verde text-white w-100">Ver historial</a>
                            </div>
                        </div>
                    </div>

                    {/* Citas por semana */}
                    <div className="col-md-7">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <h5>Citas por semana</h5>
                            <CitasPorSemanaChart />
                            </div>
                        </div>
                    </div>

                    {/* Pacientes hoy */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body">
                            <h6>Pacientes hoy</h6>
                            <ul className="list-unstyled mt-3">
                                <li><span className="badge bg-success rounded-circle me-2">&nbsp;</span> María del Carmen</li>
                                <li><span className="badge bg-success rounded-circle me-2">&nbsp;</span> Carla Lescano</li>
                                <li><span className="badge bg-success rounded-circle me-2">&nbsp;</span> Mario Saenz</li>
                                <li><span className="badge bg-success rounded-circle me-2">&nbsp;</span> Esteban Toto</li>
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-3">
                <div className="row g-3">  
                    
                    {/* Equipo de trabajo */}
                    <div className="col-md-5">
                    <div className="card color-fondo-card-amarillo shadow-sm h-100">
                        <div className="card-body">
                        <h6>Equipo de trabajo</h6>
                        <p className="mb-1">🟡 Alexandra Maratea - Atendiendo a ...</p>
                        <p>🟢 Totok Mireia - Atendiendo a ...</p>
                        </div>
                    </div>
                    </div>

                    {/* Horario */}
                    <div className="col-md-4">
                    <div className="card card-gradient-verde-oscuro text-white shadow-sm h-100">
                        <div className="card-body d-flex flex-column justify-content-between">
                        <div className="d-flex justify-content-between">
                            <span>Horario</span>
                            <span>Lunes 18-05-25</span>
                        </div>
                        <h1 className="mt-3 text-center">01:58:03 PM</h1>
                        <p className="text-center">Atendiendo a ...</p>
                        </div>
                    </div>
                    </div>

                    {/* Citas no asistidas */}
                    <div className="col-md-3 ">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas para hoy</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="mt-3">12</h1>
                            <p className="mt-2">↑ Más que ayer</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>  

        </>
    );
}

