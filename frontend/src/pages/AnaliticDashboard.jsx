import React from 'react';
import './AnaliticDashboard.css'
import CitasPorSemanaChart from '../components/CitasPorSemanaChart';
import recordatorio from '../assets/recordatorio.png'
import alerta from '../assets/alert.png'
import archivo from '../assets/file.png'
import { Calendar, Clock, UserCheck, Hourglass, XCircle } from 'lucide-react';
import GraficoAtencion from '../components/GraficaAtencion';



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
                                <span>Total de pacientes registrados</span>
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
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <h6 className="fw-bold">Cita con María Llamas Echeverría</h6>
                            <p>Hora: 2:00 pm - 3:00 pm<br/>Último diagnóstico: Bruxismo<br/>Última visita: 05-01-25</p>
                            <a href="#" className="btn card-gradient-verde text-white w-100">Ver historial</a>
                            </div>
                        </div>
                    </div>

                    {/* Citas por semana */}
                    <div className="col-md-5">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <h5>Citas por semana</h5>
                            <CitasPorSemanaChart />
                            </div>
                        </div>
                    </div>

                    {/* Pacientes hoy */}
                    <div className="col-md-4">
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
                            <p className="text-start">Atendiendo a ...</p>
                        </div>
                    </div>
                    </div>

                    {/* Notas rapidas */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body">
                            <h5 className="fw-bold mb-4">Notas clínicas rápidas</h5>

                            <div className="d-flex align-items-start mb-2">
                                <img src={recordatorio} alt="Nota" className="me-2" width="30" />
                                <div>
                                <p className="mb-1 fw-bold text-primary">Recordatorio</p>
                                <small className="text-secondary">Revisar tratamiento de María del Carmen Llamas</small>
                                </div>
                            </div>

                            <div className="d-flex align-items-start mb-2">
                                <img src={alerta} alt="Alerta" className="me-2" width="30" />
                                <div>
                                <p className="mb-1 fw-bold text-warning">Alertas</p>
                                <small className="text-secondary">María es alérgica a la penicilina.</small>
                                </div>
                            </div>

                            <div className="d-flex align-items-start">
                                <img src={archivo} alt="Archivo" className="me-2" width="30" />
                                <div>
                                <p className="mb-1 fw-bold text-info">Archivos subidos</p>
                                <a href="#" className="text-decoration-underline small">click aquí</a>
                                </div>
                            </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>  
            {/*Cuarta fila */}
            <div className="row g-3 ">
                <div className="row g-3">
                    {/* Card 1 */}
                    <div className="col-md-3">
                        <div className="card card-gradient-verde text-white shadow-sm h-100 rounded-4">
                            <div className="card-body">
                            <div className="d-flex justify-content-between align-items-center">
                                <h4 className="fw-bold">Total Pacientes</h4>
                                <a href="#" className="btn btn-light btn-sm rounded-circle text-dark">↗</a>
                            </div>

                            <div className="mt-1">
                                <p><Calendar className="me-2" size={20} /> Hoy: Lunes 18 de mayo de 2025</p>
                                <p><Clock className="me-2" size={20} /> Citas programadas: <strong>24</strong></p>
                                <p><UserCheck className="me-2" size={20} /> Pacientes ya atendidos: <strong>6</strong></p>
                                <p><Hourglass className="me-2" size={20} /> Pendientes: <strong>17</strong></p>
                                <p><XCircle className="me-2" size={20} /> Cancelados: <strong>1</strong></p>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 */}
                    <div className="col-md-3 ">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas no asistidas semanales</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="tamano-numero mt-3">4</h1>
                            <p className="mt-2">↑ Más que la semana pasada</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 3 */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold  shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Pacientes recurrentes en el mes</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="tamano-numero mt-3">2</h1>
                            <p className="mt-2">↓ Más que la semana pasada</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo  color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas completadas semanal</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="tamano-numero mt-3">20</h1>
                            <p className="mt-2">↑Más que la semana pasada</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/*Quinta Fila*/ }
            <div className="row g-3 mt-4">
                {/* Columna izquierda: gráfica y leyenda */}
                <div className="col-md-9">
                    <div className="card color-fondo-card-amarillo shadow-sm h-100">
                        <div className="card-body">
                        <GraficoAtencion />
                        </div>
                    </div>
                </div>

                {/* Columna derecha: Diagnóstico más frecuente */}
                <div className="col-md-3">
                    <div className="card color-fondo-card-amarillo shadow-sm h-100 p-3 text-center">
                    <h5 className="fw-bold text-start tamano-titulo">Diagnósticos más frecuentes</h5>
                    <h2 className="fw-bold my-3 text-start">Caries - <small>(45%)</small></h2>
                    <a href="#" className="btn btn-success w-100 mt-auto">Ver pacientes</a>
                    </div>
                </div>
            </div>

            {/*Sexta fila */}
            <div className="row g-3 mt-3">
                {/* Últimos pacientes atendidos */}
                <div className="col-md-6">
                    <div className="card color-fondo-card-amarillo shadow-sm h-100">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">Últimos pacientes atendidos</h6>
                        <div className="table-responsive">
                        <table className="table table-borderless table-sm mb-0 table-transparent">
                            <thead className="text-muted">
                                <tr>
                                    <th>Paciente</th>
                                    <th>Fecha</th>
                                    <th>Diagnóstico</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <td><span className="badge rounded-circle bg-light me-2">&nbsp;</span> Cristhian Vega</td>
                                    <td>15-05-2025</td>
                                    <td>Caries en pieza 24</td>
                                </tr>
                                <tr>
                                    <td><span className="badge rounded-circle bg-light me-2">&nbsp;</span> Ana Rodríguez</td>
                                    <td>12-05-2025</td>
                                    <td>Limpieza dental</td>
                                </tr>
                                <tr>
                                    <td><span className="badge rounded-circle bg-light me-2">&nbsp;</span> José Castillo</td>
                                    <td>12-05-2025</td>
                                    <td>Caries en pieza 4</td>
                                </tr>
                                <tr>
                                    <td><span className="badge rounded-circle bg-light me-2">&nbsp;</span> María Cordera</td>
                                    <td>11-05-2025</td>
                                    <td>Brackets</td>
                                </tr>
                            </tbody>
                        </table>
                        </div>
                    </div>
                    </div>
                </div>

                {/* Indicadores de pacientes */}
                <div className="col-md-6">
                    <div className="card card-gradient-verde text-white shadow-sm h-100">
                    <div className="card-body">
                        <h6 className="fw-bold mb-3">Indicadores de pacientes</h6>
                        <div className=" tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                            <span>Pacientes activos</span>
                            <span> 18 </span>
                        </div>
                        <div className=" tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                            <span>Nuevos este mes</span>
                            <span> 4 </span>
                        </div>
                        <div className=" tamano-titulo d-flex justify-content-between align-items-center gap-2 py-1">
                            <span>Citas de seguimiento</span>
                            <span> 4 </span>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
        </>
    );
}

