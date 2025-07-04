
import { createPortal } from 'react-dom';
import React, {useState, useEffect } from 'react';
import axios from 'axios';
import axiosInstance from '../api/axiosInstance';
import {Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import es from 'date-fns/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import qs from 'qs';
import { useNavigate } from 'react-router-dom';

import moment from 'moment';






import './BigCalendar.css'
//Configurar locales en español

const locales = {
    'es': es,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});




export default function BigCalendar({refreshTrigger, filters }){
    const navigate = useNavigate();

    const [eventos, setEventos] = useState([])
    const [tooltip, setTooltip] = useState({ visible: false, content: '', x: 0, y: 0 });
    const [vistaActual, setVistaActual] = useState('week');
    
    const [fecha, setFecha] = useState(new Date());

    const now = new Date();

    const [showModal, setShowModal] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [pacientes, setPacientes] = useState([]); // lista de pacientes
    const [formData, setFormData] = useState({
        pacienteId: '',
        motivo_consulta: '',
    });
    const [profesionales, setProfesionales] = useState([]);


    useEffect(() => {

             // Construir query params
            const params = {};

            if (filters.estados.length > 0) {
                    params.estado = filters.estados;  // 🚀 NO usar join
            }

            if (filters.profesionales.length > 0) {
                params.profesional = filters.profesionales;  // 🚀 NO usar join
            }

            axiosInstance.get('citas/', { 
                params,
                paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
            })
            .then(res => {
                const citas = res.data.map(cita => ({
                    id: cita.id,
                    title: `${cita.paciente.nombre} ${cita.paciente.apellido}`,
                    start: new Date(`${cita.fecha.split('T')[0]}T${cita.hora_inicio}`),
                    end: new Date(`${cita.fecha.split('T')[0]}T${cita.hora_fin}`),
                    motivo: cita.motivo_consulta,
                    estado: cita.estado,
                    profesional: `${cita.profesional.usuario.nombre} ${cita.profesional.usuario.apellido}`,
                    hora: `${cita.hora_inicio} - ${cita.hora_fin}`,
                    resourceId: cita.profesional.id, 
                    }));
                setEventos(citas);
            })
            .catch(err => console.error('Error cargando citas:', err));
        }, [refreshTrigger,JSON.stringify(filters)]);

        useEffect(() => {
            axiosInstance.get('profesionales/')
                .then(res => {
                    const recursos = res.data.map(prof => ({
                        id: prof.id,
                        nombre: `${prof.usuario.nombre} ${prof.usuario.apellido}`,
                    }));
                    setProfesionales(recursos);
                })
                .catch(err => console.error('Error cargando profesionales:', err));
        }, []);

        const CustomEvent = ({ event }) => {
            const handleMouseEnter = (e) => {
            setTooltip({
                visible: true,
                content: `
                <strong>id:</strong> ${event.id}<br/>
                <strong>Paciente:</strong> ${event.title}<br/>
                <strong>Atención:</strong> ${event.motivo}<br/>
                <strong>Profesional:</strong> ${event.profesional}<br/>
                <strong>Hora:</strong> ${event.hora}<br/>
                <strong>Estado:</strong> ${event.estado}<br/>
                `,
                x: e.clientX,
                y: e.clientY
            });
            };

            const handleMouseLeave = () => {
                setTooltip({ visible: false, content: '', x: 0, y: 0 });
            };

            return (
                <div
                    className="evento-calendario"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => navigate(`/dashboard/cita/${event.id}/observaciones`)}
                    style={{ cursor: 'pointer' }}
                >
                    <p>{event.title}</p>
                </div>
            );
        };
        


    return(
        
        <div className='contenedor-calendario '>
        
            <Calendar
                key={JSON.stringify(filters)} 
                components={{ event: CustomEvent }}
                eventPropGetter={(event) => {
                    let borderColor = '';

                    switch (event.estado) {
                        case 'pendiente':
                            borderColor = '#f1c40f'; // amarillo
                            break;
                        case 'confirmada':
                            borderColor = '#2ecc71'; // verde
                            break;
                        case 'cancelada':
                            borderColor = '#e74c3c'; // rojo
                            break;
                        case 'no_asistida':
                            borderColor = '#9b59b6'; // violeta
                            break;
                        case 'completada':
                            borderColor = '#3498db'; // azul
                            break;
                        default:
                            borderColor = '#bdc3c7'; // gris por defecto
                    }

                    return {
                        style: {
                        backgroundColor: 'white',
                        
                        color: '#333',
                        borderRadius: '4px',
                        border: `2px solid ${borderColor}`,
                        borderLeftWidth: '7px', // más grueso en el borde izquierdo
                        
                        padding: '2px',
                        fontWeight: 'bold',
                        fontSize: '9px', // más chico el texto
                        cursor: 'pointer',
                        boxSizing: 'border-box',
                        boxShadow: '2px 0 0 white' ,
                        }
                    };
                }}
                titleAccessor={() => null}
                date={fecha}
                onNavigate={date => setFecha(date)}
                localizer={localizer}
                events={eventos}
                startAccessor="start"
                endAccessor="end"
                view={vistaActual}
                min={new Date(now.getFullYear(), now.getMonth(), now.getDate(), 8, 0)}  // 8:00 AM
                max={new Date(now.getFullYear(), now.getMonth(), now.getDate(), 21, 0)} // 9:00 PM
                onView={(nuevaVista) => setVistaActual(nuevaVista)}
                views={['month', 'week', 'day', 'agenda']}
                defaultView="week" 
                
                toolbar={true}
                style={{
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '10px'
                }}
                messages={{
                    today: 'Hoy',
                    previous: 'Anterior',
                    next: 'Siguiente',
                    month: 'Mes',
                    week: 'Semana',
                    day: 'Día',
                    agenda: 'Agenda',
                }}
                

                
            />
            {tooltip.visible && (
                <div
                className="custom-tooltip global"
                dangerouslySetInnerHTML={{ __html: tooltip.content }}
                    style={{
                        top: tooltip.y + 10,
                        left: tooltip.x + 10,
                        position: 'fixed',
                        zIndex: 10000
                    }}
                />
                )
            }
    

        </div>
    );
};