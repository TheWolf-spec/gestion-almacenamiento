
import React from 'react';
import { FaTrash } from 'react-icons/fa'; 
import './Block.css';

export default function Block({ bloque, isSelectable, onClick, isHighlighted, onDoubleClick, onDelete }) {
    const blockStyle = {
        left: `${bloque.pos_x}%`,
        top: `${bloque.pos_y}%`,
        width: `${bloque.ancho}%`,
        height: `${bloque.alto}%`,
    };

    const classNames = `map-block ${isSelectable ? 'selecting' : ''} ${isHighlighted ? 'highlighted' : ''}`;
    const eventHandler = isSelectable ? { onClick: onClick } : { onDoubleClick: onDoubleClick };

    const handleDeleteClick = (e) => {
        e.stopPropagation();
        onDelete(); 
    };

    return (
        <div className={classNames} style={blockStyle} {...eventHandler}>
            <span className="block-name">{bloque.nombre}</span>

            {!isSelectable && (
                <button className="delete-block-btn" onClick={handleDeleteClick}>
                    <FaTrash />
                </button>
            )}
        </div>
    );
}