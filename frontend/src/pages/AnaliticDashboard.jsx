import React, { useState, useEffect,useRef } from 'react';
import './AnaliticDashboard.css'
import CitasPorSemanaChart from '../components/CitasPorSemanaChart';
import recordatorio from '../assets/recordatorio.png'
import alerta from '../assets/alert.png'
import archivo from '../assets/file.png'
import { Calendar, Clock, UserCheck, Hourglass, XCircle } from 'lucide-react';
import GraficoAtencion from '../components/GraficaAtencion';
import axiosInstance from '../api/axiosInstance';
import { compareAsc, startOfWeek, endOfWeek, parseISO, isWithinInterval, isSameMonth, isSameYear  } from 'date-fns';
import UltimosPacientesAtendidosCard from '../components/UltimosPacientesAtendidosCard';
import IndicadoresPacientesCard from "../components/IndicadoresPacientesCard";






export default function AnaliticDashboard() {

    const [pacientes, setPacientes] = useState([])
    const [cantidadPacientes, setcantidadPacientes] = useState([])
    const [citas, setCitas] = useState([]);
    const [citasHoy, setcitasHoy] = useState([])
    const [cantidadCitasHoy, setCantidadCitasHoy] = useState(0);
    const [cantidadCitasCanceladas, setCantidadCitasCanceladas] = useState(0);
    const [cantidadCitasSinConfirmar, setCantidadCitasSinConfirmar] = useState([])
    const [fechaHoraActual, setFechaHoraActual] = useState(new Date());
    const [atencionesHoy, setAtencionesHoy] = useState([]);
    const [cantidadCitasNoAsistidasSemana, setCantidadCitasNoAsistidasSemana] = useState(0);
    const [cantidadPacientesRecurrentesMes, setCantidadPacientesRecurrentesMes] = useState(0);
    const [citasCompletadasSemana, setCitasCompletadasSemana] = useState(0);
    const [comparacionSemanal, setComparacionSemanal] = useState('');
    const [diagnostico, setDiagnostico] = useState(null);


    const [citaProxima, setCitaProxima] = useState(null);

    const [proximaCita, setProximaCita] = useState(null);

    const [resumenCitas, setResumenCitas] = useState({
        total: 0,
        atendidas: 0,
        pendientes: 0,
        canceladas: 0
    });

    


    const fechaFormateada = fechaHoraActual.toLocaleDateString('es-CR', {
        weekday: 'long',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const horaFormateada = fechaHoraActual.toLocaleTimeString('es-CR', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    });


    const refrescarPacientes = () => {
        axiosInstance.get('/pacientes/')
            .then(response => {
                setPacientes(response.data);
                setcantidadPacientes(response.data.length);
                
            })
            .catch(error => {
                console.error("Error al traer los datos pacientes:", error);
                setPacientes([]);
            });
    };

    useEffect(() => {
        
        refrescarPacientes();
        axiosInstance.get('/pacientes/')
            .then(response => {
                setPacientes(response.data);
                
            })
            .catch(error => {
                console.error("Error al traer los datos: ", error);
                setPacientes([]);
                setCantidadPacientes(0);
            });
        
            // CITAS
            axiosInstance.get('/citas/')
                .then(response => {
                    const hoy = new Date();
                    hoy.setHours(0, 0, 0, 0);
                    const inicioDia = new Date(hoy.setHours(0, 0, 0, 0));
                    const finDia = new Date(hoy.setHours(23, 59, 59, 999));

                    const inicioSemanaNoAsist = startOfWeek(hoy, { weekStartsOn: 1 }); // lunes
                    const finSemanaNoAsist = endOfWeek(hoy, { weekStartsOn: 1 }); // domingo
                    
                    const citasNoAsistidasSemana = response.data.filter(cita => {
                        const fechaCita = parseISO(cita.fecha);
                        return ( cita.estado === 'no_asistida' &&
                            isWithinInterval(fechaCita, { start: inicioSemanaNoAsist, end: finSemanaNoAsist })
                        );
                    });

                    const ahora = new Date();

                    const citasHoy = response.data.filter(cita => {
                        const fechaCita = new Date(cita.fecha);
                        return (
                            fechaCita.getFullYear() === hoy.getFullYear() &&
                            fechaCita.getMonth() === hoy.getMonth() &&
                            fechaCita.getDate() === hoy.getDate()
                        );
                    });

                    const total = citasHoy.length;
                    const atendidas = citasHoy.filter(c => c.estado === 'completada').length;
                    const pendientes = citasHoy.filter(c => c.estado === 'pendiente').length;
                    const canceladas = citasHoy.filter(c => c.estado === 'cancelada').length;

                    setResumenCitas({
                        total,
                        atendidas,
                        pendientes,
                        canceladas,
                    });


                    const citasEnCurso = response.data.filter(cita => {
                        
                        const fechaCita = cita.fecha;
                        const hoy = new Date().toISOString().split('T')[0];

                        if (!fechaCita.startsWith(hoy)) return false;

                        const [hora, minuto] = cita.hora_inicio.split(':');
                        const [horaFin, minutoFin] = cita.hora_fin.split(':');

                        const inicio = new Date(fechaCita);
                        inicio.setHours(parseInt(hora));
                        inicio.setMinutes(parseInt(minuto));

                        const fin = new Date(fechaCita);
                        fin.setHours(parseInt(horaFin));
                        fin.setMinutes(parseInt(minutoFin));

                        return ahora >= inicio && ahora <= fin;
                    });

                    setAtencionesHoy(citasEnCurso);
                    setcitasHoy(citasHoy);
                    setCantidadCitasHoy(citasHoy.length);
                    setResumenCitas({ total, atendidas, pendientes, canceladas });
                    setCantidadCitasNoAsistidasSemana(citasNoAsistidasSemana.length);


                    const inicioSemana = startOfWeek(new Date(), { weekStartsOn: 1 });
                    const finSemana = endOfWeek(new Date(), { weekStartsOn: 1 });

                    const citasCanceladasSemana = response.data.filter(cita => {
                        const fechaCita = parseISO(cita.fecha);
                        return cita.estado === 'cancelada' &&
                            isWithinInterval(fechaCita, { start: inicioSemana, end: finSemana });
                    });

                    const citasSinConfirmarSemana = response.data.filter(cita => {
                        const fechaCita = parseISO(cita.fecha);
                        return cita.estado === 'pendiente' &&
                            isWithinInterval(fechaCita, { start: inicioSemana, end: finSemana });
                    });

                    setCantidadCitasCanceladas(citasCanceladasSemana.length);
                    setCantidadCitasSinConfirmar(citasSinConfirmarSemana.length);



                    //Pacientes recurrentes por mes:
                    const mesActual = ahora.getMonth();
                    const anioActual = ahora.getFullYear();

                    const citasDelMes = response.data.filter(cita => {
                    const fecha = new Date(cita.fecha);
                    const fechaLocal = new Date(fecha.getTime() + fecha.getTimezoneOffset() * 60000); // Ajustar zona horaria

                    return (
                        fechaLocal.getMonth() === mesActual &&
                        fechaLocal.getFullYear() === anioActual
                    );
                    });
                    const conteoPorPaciente = {};
                        citasDelMes.forEach(cita => {
                        const id = cita.paciente?.id;
                        if (id) {
                            conteoPorPaciente[id] = (conteoPorPaciente[id] || 0) + 1;
                        }
                    });
                    const pacientesRecurrentes = Object.values(conteoPorPaciente).filter(c => c > 1).length;
                    setCantidadPacientesRecurrentesMes(pacientesRecurrentes);

                    // Citas completas semanales
                    // Día domingo de esta semana
                    const primerDiaSemanaActual = new Date(hoy);
                    primerDiaSemanaActual.setDate(hoy.getDate() - hoy.getDay()); // domingo

                    // Día sábado de esta semana
                    const ultimoDiaSemanaActual = new Date(primerDiaSemanaActual);
                    ultimoDiaSemanaActual.setDate(primerDiaSemanaActual.getDate() + 6); // sábado

                    // Semana pasada (domingo a sábado)
                    const primerDiaSemanaPasada = new Date(primerDiaSemanaActual);
                    primerDiaSemanaPasada.setDate(primerDiaSemanaActual.getDate() - 7);

                    const ultimoDiaSemanaPasada = new Date(primerDiaSemanaActual);
                    ultimoDiaSemanaPasada.setDate(primerDiaSemanaActual.getDate() - 1);

                    // Aseguramos que todas las fechas estén en local (si vienen en UTC)
                    const ajustarZonaHoraria = fecha => {
                        const offsetMs = fecha.getTimezoneOffset() * 60000;
                        return new Date(fecha.getTime() - offsetMs);
                    };

                    // Citas completadas esta semana
                    const citasCompletadasSemanaActual = response.data.filter(cita => {
                        const fechaCita = ajustarZonaHoraria(new Date(cita.fecha));
                        return (
                            cita.estado === 'completada' &&
                            fechaCita >= primerDiaSemanaActual &&
                            fechaCita <= ultimoDiaSemanaActual
                        );
                    });

                    // Citas completadas semana pasada
                    const citasCompletadasSemanaPasada = response.data.filter(cita => {
                        const fechaCita = ajustarZonaHoraria(new Date(cita.fecha));
                        return (
                            cita.estado === 'completada' &&
                            fechaCita >= primerDiaSemanaPasada &&
                            fechaCita <= ultimoDiaSemanaPasada
                        );
                    });

                    setCitasCompletadasSemana(citasCompletadasSemanaActual.length);
                    setComparacionSemanal(
                        citasCompletadasSemanaActual.length > citasCompletadasSemanaPasada.length
                            ? '↑Más que la semana pasada'
                            : citasCompletadasSemanaActual.length < citasCompletadasSemanaPasada.length
                            ? '↓Menos que la semana pasada'
                            : 'Igual que la semana pasada'
                    );
                
                })
                .catch(error => {
                    console.log("Ocurrió un error al traer los datos ", error);
                    setcitasHoy([]);
                    setCantidadCitasHoy(0);
                    setCantidadCitasCanceladas(0);
                    setCantidadPacientesRecurrentesMes(0);
                });

            const intervalo = setInterval(() => {
                setFechaHoraActual(new Date());
        }, 1000);

        return () => clearInterval(intervalo);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get('/grafico-atencion/');
                if (Array.isArray(response.data)) {
                    const parsedData = response.data.map(item => ({
                        ...item,
                        mesActual: Number(item.mesActual),
                        mesAnterior: Number(item.mesAnterior)
                    }));
                    const top = parsedData.reduce((max, item) =>
                        item.mesActual > (max?.mesActual || 0) ? item : max, null
                    );
                    setDiagnostico(top);
                } else {
                    console.error("Respuesta no es una lista");
                }
            } catch (error) {
                console.error("Error al cargar diagnóstico más frecuente:", error);
            }
        };

        fetchData();
    }, []);

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
                            <h1 className="mt-3">{cantidadPacientes}</h1>
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
                            <h1 className="mt-3">{cantidadCitasHoy}</h1>
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
                            <h1 className="mt-3">{cantidadCitasSinConfirmar}</h1>
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
                            <h1 className="mt-3">{cantidadCitasCanceladas}</h1>
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
                    {proximaCita && (
                        <div className="card mt-4 p-3 shadow-sm border rounded">
                            <h5>Próxima cita de hoy</h5>
                            <p><strong>Paciente:</strong> {proximaCita.paciente?.nombre || 'No disponible'}</p>
                            <p><strong>Hora:</strong> {new Date(proximaCita.fecha).toLocaleTimeString('es-CR', {
                            hour: '2-digit',
                            minute: '2-digit'
                            })}</p>
                        </div>
                        )}

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
                    <div className="col-md-5">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body">
                            <h6>Pacientes hoy</h6>
                            <ul className="list-unstyled mt-3">
                                {citasHoy.length > 0 ? (
                                citasHoy.map((cita, index) => (
                                    <li key={index}>
                                    <span className="badge bg-success rounded-circle me-2">&nbsp;</span>
                                    {cita.paciente?.nombre || 'Paciente sin nombre'}
                                    </li>
                                ))
                                ) : (
                                <li><em>No hay pacientes hoy</em></li>
                                )}
                            </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row g-3">
                <div className="row g-3">  
                    
                    {/* Equipo de trabajo */}
                    <div className="col-md-6">
                        <div className="card color-fondo-card-amarillo shadow-sm h-100">
                            <div className="card-body">
                                <h6>Equipo de trabajo</h6>
                                {atencionesHoy.map((cita, index) => (
                                    <p key={index}>
                                    <span className="me-2" style={{ color: '#3c9c6e' }}>🟢</span>
                                    {cita.profesional?.usuario?.nombre || 'Profesional desconocido'} {cita.profesional?.usuario?.apellido || ''} - Atendiendo a {cita.paciente?.nombre || 'Paciente desconocido'} {cita.paciente?.apellido || 'Paciente desconocido'}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Horario */}
                    <div className="col-md-6">
                        <div className="card card-gradient-verde-oscuro text-white shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Horario</span>
                                <span>{fechaFormateada}</span>
                            </div>
                                <h1 className="mt-3 text-center">{horaFormateada}</h1>
                                <br />
                                <br />
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
                                <p><Calendar className="me-2" size={20} /> Hoy: {new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                <p><Clock className="me-2" size={20} /> Citas programadas: <strong>{resumenCitas.total}</strong></p>
                                <p><UserCheck className="me-2" size={20} /> Pacientes ya atendidos: <strong>{resumenCitas.atendidas}</strong></p>
                                <p><Hourglass className="me-2" size={20} /> Pendientes: <strong>{resumenCitas.pendientes}</strong></p>
                                <p><XCircle className="me-2" size={20} /> Cancelados: <strong>{resumenCitas.canceladas}</strong></p>
                            </div>
                            </div>
                        </div>
                    </div>

                    {/* Card 2 Cotas no asistidas semanales */}
                    <div className="col-md-3 ">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                            <div className="d-flex justify-content-between">
                                <span>Citas no asistidas semanales</span>
                                <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                            </div>
                            <h1 className="tamano-numero mt-3">{cantidadCitasNoAsistidasSemana}</h1>

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
                            
                            <h1 className="tamano-numero mt-3">{cantidadPacientesRecurrentesMes}</h1>

                            <p className="mt-2">↓ Más que la semana pasada</p>
                            </div>
                        </div>
                    </div>

                    {/* Card 4 */}
                    <div className="col-md-3">
                        <div className="card color-fondo-card-amarillo color-texto-verde color-texto-negro-bold shadow-sm h-100">
                            <div className="card-body d-flex flex-column justify-content-between">
                                <div className="d-flex justify-content-between">
                                    <span>Citas completadas semanal</span>
                                    <a href="#" className="btn btn-light btn-sm rounded-circle">↗</a>
                                </div>
                                <h1 className="tamano-numero mt-3">{citasCompletadasSemana}</h1>
                                <p className="mt-2">{comparacionSemanal}</p>
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
                        <h5 className="fw-bold text-start tamano-titulo">Diagnóstico más frecuente</h5>
                        {diagnostico ? (
                            <h2 className="fw-bold my-3 text-start">
                                {diagnostico.diagnostico} - <small>({diagnostico.porcentaje})</small>
                            </h2>
                        ) : (
                            <p className="text-muted text-start">Cargando...</p>
                        )}
                        <a href="#" className="btn btn-success w-100 mt-auto">Ver pacientes</a>
                    </div>
                </div>
            </div>

            {/*Sexta fila */}
            <div className="row g-3 mt-3">
                {/* Últimos pacientes atendidos */}
                <UltimosPacientesAtendidosCard />
                
                

                {/* Indicadores de pacientes */}
                <IndicadoresPacientesCard />
            </div>
        </>
    );
}

