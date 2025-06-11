import React, { useState }  from 'react';
import BigCalendar from '../components/BigCalendar';
import BotonesCalendario from '../components/BotonesCalendario';
import Filter from '../components/Filter';



export default function Calendario() {
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [filterValues, setFilterValues] = useState({
        profesionales: [],
        estados: [],
        rangoHora: '08:00 - 12:00'
    });
    const [profesionales, setProfesionales] = useState([]);

    const handleAplicarFiltros = (filtros) => {
        setFilterValues(filtros);
    };

    const handleCitaCreada = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    return(
        <>
           
            
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <div style={{ width: '250px' }}>
                    <Filter onAplicar={handleAplicarFiltros} />
                </div>
                <div style={{ flex: 1, minWidth: 0, height: '700px' }}>
                    <BotonesCalendario onCitaCreada={handleCitaCreada} />
                    <BigCalendar refreshTrigger={refreshTrigger} filters={filterValues}   resources={profesionales}
                        resourceIdAccessor="id"
                        resourceTitleAccessor="nombre"
                    />
                </div>
            </div>
        </>
    );
}