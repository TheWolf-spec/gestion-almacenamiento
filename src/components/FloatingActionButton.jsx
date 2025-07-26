import React, { useState } from 'react';
import { FaPlus, FaPencilAlt, FaTrash, FaMapMarkedAlt, FaBoxOpen, FaSyncAlt } from 'react-icons/fa';
import './FloatingActionButton.css';

// iconos por defecto por si no se especifican no cambiar nada
const defaultIcons = {
    crear: <FaMapMarkedAlt />,
    modificar: <FaPencilAlt />,
    eliminar: <FaTrash />,
};

export default function FloatingActionButton({ actions }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div className="fab-container">
            {isMenuOpen && (
                <div className="fab-menu">
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