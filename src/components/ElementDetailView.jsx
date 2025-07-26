// Contenido para: frontend/src/components/ElementDetailView.jsx

import React, { useRef } from 'react';
import { FaTrash, FaPlusCircle } from 'react-icons/fa';
import './ElementDetailView.css';

export default function ElementDetailView({ element, blockName, onClose, onEdit, onDelete, onAddFiles, onDeleteFile }) {
    // useRef nos permite acceder a un elemento del DOM, en este caso el input de archivo oculto
    const fileInputRef = useRef(null);

    // Función para determinar si el archivo es imagen o documento
    const getFileType = (fileName) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = fileName.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension) ? 'imagen' : 'documento';
    };

    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            onAddFiles(e.target.files);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-detail" onClick={(e) => e.stopPropagation()}>
                <button className="delete-element-btn" onClick={() => onDelete(element.id)}>
                    <FaTrash />
                </button>
                <h3>Detalles del Elemento</h3>
                <div className="detail-row"><span className="detail-label">Nombre:</span><span className="detail-value">{element.nombre}</span></div>
                <div className="detail-row"><span className="detail-label">Nombre del Bloque:</span><span className="detail-value">{blockName}</span></div>
                
                <div className="detail-row column">
                    <span className="detail-label">Acerca del contenido del elemento:</span>
                    <p className="detail-description">{element.descripcion || 'No hay descripción.'}</p>
                </div>

                {/* Sección para mostrar los archivos */}
                <div className="files-section">
                    <h4>Imágenes</h4>
                    {element.archivos?.filter(a => a.tipo_archivo === 'imagen').map(file => (
                        <div key={file.id} className="file-item">
                            <a href={`http://fjrg.infinityfreeapp.com/GestionAlmacenamiento/${file.ruta_archivo}`} target="_blank" rel="noopener noreferrer">{file.nombre_original}</a>
                            <button onClick={() => onDeleteFile(file.id)} className="delete-file-btn"><FaTrash /></button>
                        </div>
                    ))}
                    {element.archivos?.filter(a => a.tipo_archivo === 'imagen').length === 0 && <span className="no-files-text">No hay imágenes.</span>}

                    <h4>Documentos</h4>
                    {element.archivos?.filter(a => a.tipo_archivo === 'documento').map(file => (
                        <div key={file.id} className="file-item">
                            <a href={`http://fjrg.infinityfreeapp.com/GestionAlmacenamiento/${file.ruta_archivo}`} target="_blank" rel="noopener noreferrer">{file.nombre_original}</a>
                            <button onClick={() => onDeleteFile(file.id)} className="delete-file-btn"><FaTrash /></button>
                        </div>
                    ))}
                    {element.archivos?.filter(a => a.tipo_archivo === 'documento').length === 0 && <span className="no-files-text">No hay documentos.</span>}
                </div>
                
                {/* Input de archivo oculto */}
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    multiple 
                    style={{ display: 'none' }} 
                />

                <div className="form-actions">
                    <button className="btn-add-file" onClick={() => fileInputRef.current.click()}>
                        <FaPlusCircle /> Añadir Archivos
                    </button>
                    <button className="btn-edit" onClick={() => onEdit(element)}>Editar</button>
                    <button className="btn-accept" onClick={onClose}>Aceptar</button>
                </div>
            </div>
        </div>
    );
}