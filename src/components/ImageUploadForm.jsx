
import React, { useState } from 'react';
import axios from 'axios';
import './ImageUploadForm.css';

export default function ImageUploadForm({ mapaId, onUploadSuccess }) {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedFile) {
            setError('Por favor, selecciona un archivo.');
            return;
        }

        setUploading(true);
        setError('');

        // Usamos FormData para enviar archivos
        const formData = new FormData();
        formData.append('imagen', selectedFile);
        formData.append('mapa_id', mapaId);

        const apiUrl = 'https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/subir_imagen_mapa.php';

        axios.post(apiUrl, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            onUploadSuccess(response.data.imagen_url);
        })
        .catch(err => {
            const errorMessage = err.response ? err.response.data.message : "Error de conexión o en el servidor.";
            setError(errorMessage);
        })
        .finally(() => {
            setUploading(false);
        });
    };

    return (
        <div className="upload-form-container">
            <h3>Este mapa no tiene imagen</h3>
            <p>Sube una imagen para empezar a añadir bloques.</p>
            <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleFileChange} accept="image/png, image/jpeg, image/gif" />
                <button type="submit" disabled={uploading}>
                    {uploading ? 'Subiendo...' : 'Subir Imagen'}
                </button>
            </form>
            {error && <p className="upload-error">{error}</p>}
        </div>
    );
}