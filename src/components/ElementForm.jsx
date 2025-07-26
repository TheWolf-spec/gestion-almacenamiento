// Contenido para: frontend/src/components/ElementForm.jsx

import React, { useState } from 'react';
import './ElementForm.css';

export default function ElementForm({ onSubmit, onCancel }) {
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [files, setFiles] = useState(null); // Estado para guardar los archivos seleccionados

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!nombre) {
            alert('El nombre es obligatorio.');
            return;
        }
        // Pasamos los archivos al submit
        onSubmit({ nombre, descripcion, files });
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Añadir Nuevo Elemento</h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="nombre">Nombre (Obligatorio)</label>
                        <input type="text" id="nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} />
                    </div>
                    
                    {/* Input para subir múltiples archivos */}
                    <div className="form-group">
                        <label htmlFor="files">Subir Archivos (Opcional)</label>
                        <input type="file" id="files" onChange={(e) => setFiles(e.target.files)} multiple />
                    </div>

                    <div className="form-group">
                        <label htmlFor="descripcion">Acerca del contenido del Elemento (Opcional)</label>
                        <textarea id="descripcion" rows="4" value={descripcion} onChange={(e) => setDescripcion(e.target.value)}></textarea>
                    </div>
                    
                    <div className="form-actions">
                        <button type="submit" className="btn-submit">Añadir</button>
                        <button type="button" className="btn-cancel" onClick={onCancel}>Cancelar</button>
                    </div>
                </form>
            </div>
        </div>
    );
}