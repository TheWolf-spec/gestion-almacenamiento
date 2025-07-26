import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaMapMarkedAlt, FaBoxOpen, FaSyncAlt } from 'react-icons/fa';
import './FloatingActionButton.css';

// Definimos unos iconos por defecto por si no se especifican
const defaultIcons = {
    crear: <FaMapMarkedAlt />,
    modificar: <FaPencilAlt />,
    eliminar: <FaTrash />,
};

// Recibimos las acciones y ahora también las etiquetas e iconos como props
export default function FloatingActionButton({ actions }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fab-container">
            {isMenuOpen && (
                <div className="fab-menu">
                    {/* Hacemos un map sobre el array de acciones */}
                    {actions.map((action, index) => (
                        <button key={index} className="fab-menu-item" onClick={() => { action.onClick(); toggleMenu(); }}>
                            {action.icon || defaultIcons[action.type]}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            )}
            <button className="fab-main" onClick={toggleMenu}>
                <FaPlus />
            </button>
        </div>
    );
}