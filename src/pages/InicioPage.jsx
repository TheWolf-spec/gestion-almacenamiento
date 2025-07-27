import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../components/Header';
import MapList from '../components/MapList';
import FloatingActionButton from '../components/FloatingActionButton';
import { FaMapMarkedAlt, FaPencilAlt, FaTrash } from 'react-icons/fa';

export default function InicioPage() {
    const [mapas, setMapas] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        axios.get('http://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/mapas.php')
            .then(response => { setMapas(response.data); })
            .catch(error => { console.error("Error al obtener los mapas:", error); });
    }, []);

    const handleCrearMapa = () => {
        const nombreMapa = prompt('Introduce el nombre del nuevo mapa:');
        if (nombreMapa && nombreMapa.trim() !== '') {
            const apiUrl = 'http://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/crear_mapa.php';
            axios.post(apiUrl, { nombre: nombreMapa })
                .then(response => {
                    setMapas(prevMapas => [response.data, ...prevMapas]);
                    alert(response.data.message);
                })
                .catch(error => { console.error("Error al crear el mapa:", error); alert("Hubo un error al crear el mapa."); });
        }
    };
    
    const handleModificarMapa = () => {
        const listaMapas = mapas.map(mapa => `ID: ${mapa.id}, Nombre: ${mapa.nombre}`).join('\n');
        const idParaModificar = prompt('Por favor, introduce el ID del mapa que quieres modificar:\n\n' + listaMapas);

        if (!idParaModificar || isNaN(idParaModificar)) {
            if (idParaModificar) alert("Por favor, introduce un ID numérico válido.");
            return;
        }

        const nuevoNombre = prompt(`Introduce el nuevo nombre para el mapa con ID ${idParaModificar}:`);

        if (nuevoNombre && nuevoNombre.trim() !== '') {
            const apiUrl = 'http://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/modificar_mapa.php';
            
            axios.post(apiUrl, { id: idParaModificar, nombre: nuevoNombre })
                .then(response => {
                    setMapas(prevMapas => prevMapas.map(mapa => 
                        mapa.id.toString() === idParaModificar 
                            ? { ...mapa, nombre: nuevoNombre } 
                            : mapa
                    ));
                    alert(response.data.message);
                })
                .catch(error => {
                    console.error("Error al modificar el mapa:", error);
                    const mensajeError = error.response ? error.response.data.message : "Hubo un error al modificar el mapa.";
                    alert(mensajeError);
                });
        }
    };

    const handleEliminarMapa = () => {
        const listaMapas = mapas.map(mapa => `ID: ${mapa.id}, Nombre: ${mapa.nombre}`).join('\n');
        const idParaEliminar = prompt('Por favor, introduce el ID del mapa que quieres eliminar:\n\n' + listaMapas);

        if (idParaEliminar && !isNaN(idParaEliminar)) {
            if (window.confirm(`¿Estás seguro de que quieres eliminar el mapa con ID ${idParaEliminar}?`)) {
                const apiUrl = 'http://fjrg.byethost7.com/GestionAlmacenamiento/backend/api/eliminar_mapa.php';
                axios.post(apiUrl, { id: idParaEliminar })
                    .then(response => {
                        setMapas(prevMapas => prevMapas.filter(mapa => mapa.id.toString() !== idParaEliminar));
                        alert(response.data.message);
                    })
                    .catch(error => {
                        console.error("Error al eliminar el mapa:", error);
                        const mensajeError = error.response ? error.response.data.message : "Hubo un error al eliminar el mapa.";
                        alert(mensajeError);
                    });
            }
        } else if (idParaEliminar) {
            alert("Por favor, introduce un ID numérico válido.");
        }
    };

    const fabActions = [
        { label: 'Crear Mapa', onClick: handleCrearMapa, icon: <FaMapMarkedAlt /> },
        { label: 'Modificar Mapa', onClick: handleModificarMapa, icon: <FaPencilAlt /> },
        { label: 'Eliminar Mapa', onClick: handleEliminarMapa, icon: <FaTrash /> },
    ];
    
    const filteredMapas = mapas.filter(mapa => mapa.nombre.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="page-container">
            <Header
                searchTerm={searchTerm}
                onSearchChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar Mapa..."
            />
            <MapList mapas={filteredMapas} />
            <FloatingActionButton actions={fabActions} />
        </div>
    );
}