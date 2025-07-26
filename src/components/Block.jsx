// Contenido para: frontend/src/components/Block.jsx

import React from 'react';
import { FaTrash } from 'react-icons/fa'; // Importamos el ícono
import './Block.css';

// Añadimos la nueva prop 'onDelete'
export default function Block({ bloque, isSelectable, onClick, isHighlighted, onDoubleClick, onDelete }) {
    const blockStyle = {
        left: `${bloque.pos_x}%`,
        top: `${bloque.pos_y}%`,
        width: `${bloque.ancho}%`,
        height: `${bloque.alto}%`,
    };

    const classNames = `map-block ${isSelectable ? 'selecting' : ''} ${isHighlighted ? 'highlighted' : ''}`;
    const eventHandler = isSelectable ? { onClick: onClick } : { onDoubleClick: onDoubleClick };

    // Función para manejar el clic en el botón de eliminar
    const handleDeleteClick = (e) => {
        // Detenemos la propagación para evitar que se active el doble clic en el contenedor
        e.stopPropagation();
        onDelete(); // Llamamos a la función onDelete que nos pasaron
    };

    return (
        <div className={classNames} style={blockStyle} {...eventHandler}>
            <span className="block-name">{bloque.nombre}</span>

            {/* Mostramos el botón solo si el bloque NO es seleccionable */}
            {!isSelectable && (
                <button className="delete-block-btn" onClick={handleDeleteClick}>
                    <FaTrash />
                </button>
            )}
        </div>
    );
}