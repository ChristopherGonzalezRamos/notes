import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, onValue, set, remove } from "firebase/database";
import appFirebase from "../credenciales";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es'; // Importa el idioma español para Moment.js
import { FaFileExport } from "react-icons/fa";
import { getAuth } from 'firebase/auth';
import * as XLSX from 'xlsx';

moment.locale('es'); // Configura Moment.js para que use español
const localizer = momentLocalizer(moment);

const Notas = () => {
    const [events, setEvents] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [eventTitle, setEventTitle] = useState('');
    const [eventDuration, setEventDuration] = useState(1);
    const [selectEvent, setSelectEvent] = useState(null);
    const navigate = useNavigate();
    const db = getDatabase(appFirebase);
    const user = getAuth(appFirebase).currentUser; // Obtener el usuario actual

    useEffect(() => {
        if (user) {
            const notesRef = ref(db, `users/${user.uid}/notes/`); // Cambiar referencia para notas del usuario
            onValue(notesRef, (snapshot) => {
                const data = snapshot.val();
                if (data) {
                    const notesArray = Object.keys(data).map(key => ({
                        id: key,
                        title: data[key].title,
                        start: new Date(data[key].createdAt),
                        end: new Date(data[key].endAt),
                        allDay: false,
                    }));
                    setEvents(notesArray);
                }
            });
        }
    }, [db, user]);

    const handleSelectSlot = (slotInfo) => {
        setShowModal(true);
        setSelectedDate(slotInfo.start);
        setEventDuration(1); // Establece la duración predeterminada en 1 hora
        setSelectEvent(null);
        setEventTitle('');
    };

    const handleSelectedEvent = (event) => {
        setShowModal(true);
        setSelectEvent(event);
        setEventTitle(event.title);
        setSelectedDate(event.start);
        setEventDuration(moment(event.end).diff(moment(event.start), 'hours')); // Calcula la duración del evento existente
    };

    const saveEvent = () => {
        if (eventTitle && selectedDate) {
            const startDate = moment(selectedDate).toDate();
            const endDate = moment(selectedDate).add(eventDuration, 'hours').toDate();
            
            const userId = user.uid; // Obtener el ID del usuario
    
            if (selectEvent) {
                // Actualizar nota existente
                set(ref(db, `users/${userId}/notes/${selectEvent.id}`), {
                    title: eventTitle,
                    createdAt: startDate.toISOString(),
                    endAt: endDate.toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            } else {
                // Crear nueva nota
                const newEventId = new Date().getTime().toString();
                set(ref(db, `users/${userId}/notes/${newEventId}`), {
                    title: eventTitle,
                    createdAt: startDate.toISOString(),
                    endAt: endDate.toISOString(),
                    updatedAt: new Date().toISOString(),
                });
            }
            setShowModal(false);
            setEventTitle('');
        }
    };    

    const deleteEvent = () => {
        if (selectEvent) {
            const updatedEvents = events.filter((event) => event.id !== selectEvent.id);
            setEvents(updatedEvents);
            remove(ref(db, `users/${user.uid}/notes/${selectEvent.id}`));
            setShowModal(false);
            setEventTitle('');
            setSelectEvent(null);
        }
    };

    const exportToExcel = () => {
        const data = events.map(event => ({
            Actividades: event.title,
            Fecha: moment(event.start).format('YYYY-MM-DD'),
            'Hora de Inicio': moment(event.start).format('HH:mm'),
            'Hora de Fin': moment(event.end).format('HH:mm'),
        }));
    
        // Crea una hoja de trabajo con los datos
        const ws = XLSX.utils.json_to_sheet(data, {
            header: ['Actividades', 'Fecha', 'Hora de Inicio', 'Hora de Fin']
        });
        // Crea un libro de trabajo y agrega la hoja de trabajo
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Notas');
    
        // Escribe el archivo
        XLSX.writeFile(wb, 'Notas.xlsx');
    };

    return (
        <div className="container">
            <h2 className="text-center">Mis Notas</h2>
            <div style={{ height: '500px', margin: '50px' }}>
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={true}
                    onSelectSlot={handleSelectSlot}
                    onSelectEvent={handleSelectedEvent}
                    messages={{
                        next: "▶",
                        previous: "◀",
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día",
                        agenda: "Agenda",
                        date: "Fecha",
                        time: "Horas",
                        event: "Actividades",
                        noEventsInRange: "No hay eventos en este rango.",
                    }}
                />
            </div>
            {showModal && (
                <div className="modal" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)', position: 'fixed', top: 0, bottom: 0, left: 0, right: 0 }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {selectEvent ? 'Editar Nota' : 'Añadir Nota'}
                                </h5>
                                <button type="button" className="btn-close"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEventTitle('');
                                        setSelectEvent(null);
                                    }}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <label>Título de la nota</label>
                                <input
                                    type='text'
                                    className='form-control'
                                    id='eventTitle'
                                    value={eventTitle}
                                    onChange={(e) => setEventTitle(e.target.value)}
                                />
                                <label className="mt-3">Fecha y hora de inicio</label>
                                <input
                                    type='datetime-local'
                                    className='form-control'
                                    value={moment(selectedDate).format('YYYY-MM-DDTHH:mm')}
                                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                                />
                                <label className="mt-3">Duración (horas)</label>
                                <input
                                    type='number'
                                    className='form-control'
                                    value={eventDuration}
                                    min="1"
                                    max="24"
                                    onChange={(e) => setEventDuration(Number(e.target.value))}
                                />
                            </div>
                            <div className="modal-footer">
                                {selectEvent && (
                                    <button
                                        type='button'
                                        className='btn btn-danger me-2'
                                        onClick={deleteEvent}
                                    >
                                        Eliminar nota
                                    </button>
                                )}
                                <button type="button" onClick={saveEvent} className='btn btn-primary'>Guardar nota</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <div className="mt-4 d-flex justify-content-end">
                <label title="Exportar calendario">
                    <FaFileExport size={24} style={{ cursor: 'pointer' }} onClick={exportToExcel} />
                </label>
            </div>
        </div>
    );
};

export default Notas;
