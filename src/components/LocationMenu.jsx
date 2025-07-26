
import React, { useState } from 'react';
import { FaMapMarkerAlt, FaLink, FaExternalLinkAlt } from 'react-icons/fa';
import './LocationMenu.css';

export default function LocationMenu({ onUpdateLocation, onGoToLocation }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="location-menu-container">
            <button className="location-main-btn" onClick={() => setIsOpen(!isOpen)}>
                <FaMapMarkerAlt size={24} />
            </button>
            {isOpen && (
                <div className="location-options">
                    <button onClick={onUpdateLocation}>
                        <FaLink /> Actualizar Ubicación
                    </button>
                    <button onClick={onGoToLocation}>
                        <FaExternalLinkAlt /> Ir a la Ubicación
                    </button>
                </div>
            )}
        </div>
    );
}