import React from 'react';
import { Link } from 'react-router-dom'; // Para la navegación
import { FaMapMarkerAlt } from 'react-icons/fa'; // Icono de GPS
import './MapListItem.css'; // Crearemos este archivo para los estilos

// Este componente recibe un 'mapa' como prop
export default function MapListItem({ mapa }) {
    const handleGpsClick = (e) => {
        e.preventDefault(); // Previene la navegación al hacer clic en el GPS
        // Lógica para "Ir a la ubicación"
        alert(`Ir a la ubicación del mapa: ${mapa.nombre}`);
    };

    return (
        // Usamos Link para que al hacer clic en el nombre, nos lleve a la página del mapa
        <Link to={`/mapa/${mapa.id}`} className="map-list-item">
            <span span className="map-name">{mapa.nombre}</span>
            <button className="gps-button" onClick={handleGpsClick}>
                <FaMapMarkerAlt size={24} />
            </button>
        </Link>
    );
}