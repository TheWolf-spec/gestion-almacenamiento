import React from 'react';
import { Link } from 'react-router-dom'; // Para la navegation
import { FaMapMarkerAlt } from 'react-icons/fa'; // Icono de GPS
import './MapListItem.css'; // archivo para los estilos

// Recibe un 'mapa' como prop
export default function MapListItem({ mapa }) {
    const handleGpsClick = (e) => {
        e.preventDefault(); // Previene la navegación al hacer clic en el GPS
        alert(`Ir a la ubicación del mapa: ${mapa.nombre}`);
    };

    return (
        <Link to={`/mapa/${mapa.id}`} className="map-list-item">
            <span span className="map-name">{mapa.nombre}</span>
            <button className="gps-button" onClick={handleGpsClick}>
                <FaMapMarkerAlt size={24} />
            </button>
        </Link>
    );
}