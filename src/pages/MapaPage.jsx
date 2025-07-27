// Contenido FINAL, COMPLETO Y CORREGIDO para: frontend/src/pages/MapaPage.jsx

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { TransformWrapper, TransformComponent, useControls } from 'react-zoom-pan-pinch';
import { FaBoxOpen, FaPencilAlt, FaSyncAlt } from 'react-icons/fa';

import Header from '../components/Header';
import Block from '../components/Block';
import FloatingActionButton from '../components/FloatingActionButton';
import ElementForm from '../components/ElementForm';
import ElementDetailView from '../components/ElementDetailView';
import ImageUploadForm from '../components/ImageUploadForm';
import LocationMenu from '../components/LocationMenu';
import './MapaPage.css';


const MapViewer = ({ mapa, isCreating, onBlockCreate, isSelectingForElement, onBlockSelect, highlightedBlockId, onBlockDoubleClick, onBlockDelete }) => {
    const { centerView } = useControls();
    const mapWrapperRef = useRef(null);
    const [newBlock, setNewBlock] = useState(null);

    useEffect(() => {
        setTimeout(() => {
            if (mapWrapperRef.current) {
                centerView();
            }
        }, 50);
    }, [mapa.imagen_url]);

    const getCoords = (e) => {
        if (!mapWrapperRef.current) return null;
        const rect = mapWrapperRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        return { x: (x / rect.width) * 100, y: (y / rect.height) * 100 };
    };
    
    const handleMouseDown = (e) => {
        if (!isCreating || newBlock) {
            return;
        }
        const startCoords = getCoords(e);
        if (startCoords) {
            setNewBlock({ ...startCoords, width: 0, height: 0 });
        }
    };

    const handleMouseMove = (e) => {
        if (!newBlock) {
            return;
        }
        const currentCoords = getCoords(e);
        if (currentCoords) {
            const width = Math.abs(currentCoords.x - newBlock.x);
            const height = Math.abs(currentCoords.y - newBlock.y);
            const newX = Math.min(currentCoords.x, newBlock.x);
            const newY = Math.min(currentCoords.y, newBlock.y);
            setNewBlock({ x: newX, y: newY, width, height });
        }
    };

    const handleMouseUp = () => {
        if (!newBlock || newBlock.width === 0 || newBlock.height === 0) {
            setNewBlock(null);
            return;
        }
        onBlockCreate(newBlock);
        setNewBlock(null);
    };
    
    return (
        <div
            ref={mapWrapperRef}
            className="map-image-wrapper"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            style={{ cursor: isCreating ? 'crosshair' : (isSelectingForElement ? 'pointer' : 'grab') }}
        >
            <img src={`https://fjrg.byethost7.com/GestionAlmacenamiento/${mapa.imagen_url}`} alt={`Mapa de ${mapa.nombre}`} />
            {mapa.bloques && mapa.bloques.map(bloque => (
                <Block
                    key={bloque.id}
                    bloque={bloque}
                    isSelectable={isSelectingForElement}
                    onClick={() => onBlockSelect(bloque.id)}
                    isHighlighted={bloque.id === highlightedBlockId}
                    onDoubleClick={() => onBlockDoubleClick(bloque.id)}
                    onDelete={() => onBlockDelete(bloque.id)}
                />
            ))}
            {newBlock && <div className="creating-block" style={{ left: `${newBlock.x}%`, top: `${newBlock.y}%`, width: `${newBlock.width}%`, height: `${newBlock.height}%` }} />}
        </div>
    );
};

export default function MapaPage() {
    const { mapaId } = useParams();
    const navigate = useNavigate();
    const [mapaActual, setMapaActual] = useState(null);
    const [isCreating, setIsCreating] = useState(false);
    const [isSelectingForElement, setIsSelectingForElement] = useState(false);
    const [selectedBlockId, setSelectedBlockId] = useState(null);
    const [elementSearchTerm, setElementSearchTerm] = useState('');
    const [foundElement, setFoundElement] = useState(null);
    const [highlightedBlockId, setHighlightedBlockId] = useState(null);

    useEffect(() => {
        const apiUrl = `https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/get_mapa_detalle.php?id=${mapaId}`;
        axios.get(apiUrl)
            .then(response => { setMapaActual(response.data); })
            .catch(error => { console.error("Error al obtener los detalles del mapa:", error); setMapaActual(null); });
    }, [mapaId]);

    const getFileType = (fileName) => {
        const imageExtensions = ['jpg', 'jpeg', 'png', 'gif'];
        const extension = fileName.split('.').pop().toLowerCase();
        return imageExtensions.includes(extension) ? 'imagen' : 'documento';
    };

    const handleAddFiles = async (files, elementId) => {
        const apiUrl = 'https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/subir_archivo_elemento.php';
        for (const file of files) {
            const formData = new FormData();
            formData.append('archivo', file);
            formData.append('elemento_id', elementId);
            formData.append('tipo_archivo', getFileType(file.name));
            try {
                const response = await axios.post(apiUrl, formData);
                const nuevoArchivo = response.data.archivo;
                setMapaActual(prev => ({
                    ...prev,
                    bloques: prev.bloques.map(b => ({
                        ...b,
                        elementos: b.elementos.map(e => e.id === elementId ? { ...e, archivos: [...(e.archivos || []), nuevoArchivo] } : e)
                    }))
                }));
                if (foundElement) {
                    setFoundElement(prev => ({ ...prev, archivos: [...(prev.archivos || []), nuevoArchivo] }));
                }
            } catch (error) {
                console.error("Error al subir el archivo:", file.name, error);
                alert(`No se pudo subir el archivo: ${file.name}`);
            }
        }
    };

    const handleDeleteFile = (fileId) => {
        if (window.confirm("¿Estás seguro de que quieres eliminar este archivo?")) {
            const apiUrl = 'https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/eliminar_archivo_elemento.php';
            axios.post(apiUrl, { id: fileId })
                .then(() => {
                    setMapaActual(prev => ({
                        ...prev,
                        bloques: prev.bloques.map(b => ({
                            ...b,
                            elementos: b.elementos.map(e => ({
                                ...e,
                                archivos: e.archivos ? e.archivos.filter(f => f.id !== fileId) : []
                            }))
                        }))
                    }));
                    if (foundElement) {
                        setFoundElement(prev => ({ ...prev, archivos: prev.archivos.filter(f => f.id !== fileId) }));
                    }
                })
                .catch(error => { console.error("Error al eliminar el archivo:", error); alert("No se pudo eliminar el archivo."); });
        }
    };

    const handleFormSubmit = (formData) => {
        const elementToSave = { bloque_id: selectedBlockId, nombre: formData.nombre, descripcion: formData.descripcion };
        axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/crear_elemento.php', elementToSave)
            .then(response => {
                const nuevoElemento = { ...elementToSave, id: response.data.id, archivos: [] };
                setMapaActual(prev => ({
                    ...prev,
                    bloques: prev.bloques.map(b => b.id === selectedBlockId ? { ...b, elementos: [...(b.elementos || []), nuevoElemento] } : b)
                }));
                alert(response.data.message);
                if (formData.files && formData.files.length > 0) {
                    handleAddFiles(formData.files, nuevoElemento.id);
                }
            })
            .catch(error => { console.error("Error al crear elemento:", error); alert("No se pudo crear el elemento."); });
        setSelectedBlockId(null);
    };

    const handleUpdateLocation = () => {
        const nuevaUrl = prompt("Introduce la neuva URL de ubicacion \nDejalo en blanco para borrar la ubicacino actual.", mapaActual.ubicacion_url || '');
        if (nuevaUrl === null) return;
        const apiUrl = 'https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/actualizar_ubicacion.php';
        axios.post(apiUrl, { mapa_id: mapaId, ubicacion_url: nuevaUrl })
            .then(response => {
                setMapaActual(prev => ({ ...prev, ubicacion_url: nuevaUrl }));
                alert(response.data.message);
            })
            .catch(error => { console.error("Error al actualizar la ubicación:", error); alert("No se pudo actualizar la ubicación."); });
    };

    const handleGoToLocation = () => {
        if (mapaActual && mapaActual.ubicacion_url) {
            window.open(mapaActual.ubicacion_url, '_blank', 'noopener,noreferrer');
        } else {
            alert("Este mapa no tiene una ubicación guardada.");
        }
    };
    const handleFinalizeBlock = (newBlockData) => {
        const nombre = prompt("Introduce el nombre para el nuevo bloque:", "Nuevo Bloque");
        if (nombre) {
            const blockToSave = {
                mapa_id: mapaId,
                nombre,
                pos_x: newBlockData.x,
                pos_y: newBlockData.y,
                ancho: newBlockData.width,
                alto: newBlockData.height
            };
    axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/crear_bloque.php', blockToSave)
            .then(response => {
                const nuevoBloque = { ...blockToSave, id: response.data.id, elementos: [] };
                setMapaActual(prev => ({ ...prev, bloques: [...prev.bloques, nuevoBloque] }));
                alert(response.data.message);
            })
            .catch(error => {
                console.error("Error al crear el bloque:", error);
                alert("No se pudo crear el bloque.");
            });
        }
        setIsCreating(false);
    };
    const handleModifyBlockName = (blockId) => {
        const bloqueActual = mapaActual.bloques.find(b => b.id === blockId);
        if (!bloqueActual) return;
        const nuevoNombre = prompt("Introduce el nuevo nombre para el bloque :D :", bloqueActual.nombre);
        if (nuevoNombre && nuevoNombre.trim() !== '' && nuevoNombre !== bloqueActual.nombre) {

    axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/modificar_bloque.php', { id: blockId, nombre: nuevoNombre })
            .then(response => {
                setMapaActual(prev => ({
                    ...prev,
                    bloques: prev.bloques.map(b => b.id === blockId ? { ...b, nombre: nuevoNombre } : b)
                }));
                alert(response.data.message);
            })
            .catch(error => {
                console.error("Error al modificar el bloque :", error);
                alert("No se pudo modificar el bloque.");
            });
        }
    };

    const handleDeleteBlock = (blockId) => {
        if (window.confirm("Esta seguro de que quieres eliminar este bloque y todos los elementos que cotniene? :(")) {

    axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/eliminar_bloque.php', { id: blockId })
            .then(response => {
                setMapaActual(prev => ({
                    ...prev,
                    bloques: prev.bloques.filter(b => b.id !== blockId)
                }));
                alert(response.data.message);
            })
            .catch(error => {
                console.error("Error al eliminar el bloque:", error);
                alert("No se pudo eliminar el bloque.");
            });
        }
    };
    const handleUpdateElement = (elemento) => {
        const nuevoNombre = prompt("Introduce el nuevo nombre del elemento please:", elemento.nombre);
        if (nuevoNombre === null) return;
        const nuevaDescripcion = prompt("Introduce la nueva descripciOn por favor :", elemento.descripcion || '');
        if (nuevaDescripcion === null) return;
        const elementToUpdate = { id: elemento.id, nombre: nuevoNombre, descripcion: nuevaDescripcion };

    axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/modificar_elemento.php', elementToUpdate)
        .then(response => {
            setMapaActual(prev => ({
                ...prev,
                bloques: prev.bloques.map(b => ({
                    ...b,
                    elementos: b.elementos ? b.elementos.map(e => e.id === elemento.id ? { ...e, nombre: nuevoNombre, descripcion: nuevaDescripcion } : e) : []
                }))
            }));
            closeDetailView();
            alert(response.data.message);
        })
        .catch(error => {
            console.error("Error al modificar elemento:", error);
            alert("No se pudo modificar el elemento.");
        });
    };
    const handleDeleteElement = (elementId) => {
        if (window.confirm("Estas segruo de que quieres eliminar este elemento? :< ")) {

    axios.post('https://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/eliminar_elemento.php', { id: elementId })
            .then(response => {
                setMapaActual(prev => ({
                    ...prev,
                    bloques: prev.bloques.map(b => ({
                        ...b,
                        elementos: b.elementos ? b.elementos.filter(e => e.id !== elementId) : []
                    }))
                }));
                closeDetailView();
                alert(response.data.message);
            })
            .catch(error => {
                console.error("Error al eliminar el elemento:", error);
                alert("No se pudo eliminar el elemento.");
            });
        }
    };


    const handleUploadSuccess = (newImageUrl) => { setMapaActual(prev => ({ ...prev, imagen_url: newImageUrl })); };
    const handleFormCancel = () => setSelectedBlockId(null);
    const handleStartAddElement = () => setIsSelectingForElement(true);
    const handleBlockSelect = (blockId) => { setSelectedBlockId(blockId); setIsSelectingForElement(false); };
    const handleSearch = (term) => {
        setElementSearchTerm(term);
        if (!term) {
            setFoundElement(null);
            setHighlightedBlockId(null);
            return;
        }
        for (const bloque of mapaActual.bloques) {
            if (bloque.elementos) {
                const elementoEncontrado = bloque.elementos.find(el => 
                    el.nombre.toLowerCase().includes(term.toLowerCase())
                );
                if (elementoEncontrado) {
                    setFoundElement({ ...elementoEncontrado, blockName: bloque.nombre });
                    setHighlightedBlockId(bloque.id);
                    return;
                }
            }
        }
        setFoundElement(null);
        setHighlightedBlockId(null);
    };

    const closeDetailView = () => {
        setFoundElement(null);
        setHighlightedBlockId(null);
        setElementSearchTerm('');
    };

    const handleCambiarMapa = () => {
        navigate('/');
    };



    const fabActions = [
        { label: isCreating ? 'Cancelar Creación' : 'Crear Bloque', onClick: () => setIsCreating(!isCreating), icon: <FaBoxOpen /> },
        { label: isSelectingForElement ? 'Cancelar Selección' : 'Añadir Elemento', onClick: () => isSelectingForElement ? setIsSelectingForElement(false) : handleStartAddElement(), icon: <FaPencilAlt /> },
        { label: 'Cambiar Mapa', onClick: handleCambiarMapa, icon: <FaSyncAlt /> },
    ];

    if (!mapaActual) return <div>Cargando...</div>;

    return (
        <div className="page-container">
            {selectedBlockId && <ElementForm onSubmit={handleFormSubmit} onCancel={handleFormCancel} />}
            {foundElement &&
                <ElementDetailView
                    element={foundElement}
                    blockName={foundElement.blockName}
                    onClose={closeDetailView}
                    onEdit={handleUpdateElement}
                    onDelete={handleDeleteElement}
                    onAddFiles={(files) => handleAddFiles(files, foundElement.id)}
                    onDeleteFile={handleDeleteFile}
                />
            }
            <LocationMenu
                onUpdateLocation={handleUpdateLocation}
                onGoToLocation={handleGoToLocation}
            />
            <Header
                searchTerm={elementSearchTerm}
                onSearchChange={(e) => handleSearch(e.target.value)}
                placeholder="Buscar Elemento..."
            />
            <div className="map-page-content">
                <h2 className="map-title">{mapaActual.nombre}</h2>
                {mapaActual.imagen_url ? (
                    <div className="map-viewer-container">
                        <TransformWrapper limitToBounds={false} minScale={0.2} disabled={isCreating || isSelectingForElement}>
                            <TransformComponent>
                                <MapViewer
                                    mapa={mapaActual}
                                    isCreating={isCreating}
                                    onBlockCreate={handleFinalizeBlock}
                                    isSelectingForElement={isSelectingForElement}
                                    onBlockSelect={handleBlockSelect}
                                    highlightedBlockId={highlightedBlockId}
                                    onBlockDoubleClick={handleModifyBlockName}
                                    onBlockDelete={handleDeleteBlock}
                                />
                            </TransformComponent>
                        </TransformWrapper>
                    </div>
                ) : (
                    <ImageUploadForm mapaId={mapaId} onUploadSuccess={handleUploadSuccess} />
                )}
            </div>
            {mapaActual.imagen_url && <FloatingActionButton actions={fabActions} />}
        </div>
    );
}