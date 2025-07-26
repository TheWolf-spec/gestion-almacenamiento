// Contenido para: frontend/src/components/Header.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

export default function Header({ searchTerm, onSearchChange, placeholder }) {
    return (
        <header className="app-header">
            <div className="header-left">
                <Link to="/" className="header-title">Título</Link>
            </div>
            <div className="header-right">
                <input
                    type="text"
                    placeholder={placeholder || 'Buscar...'}
                    className="search-bar"
                    value={searchTerm}
                    onChange={onSearchChange}
                />
                <nav className="header-nav">
                {/* --- LÍNEA MODIFICADA --- */}
                {/* Cambiamos Link por 'a' y añadimos el enlace a WhatsApp */}
                <a 
                    href="https://wa.me/+59164707579" 
                    className="nav-link"
                    target="_blank" // Abre el enlace en una nueva pestaña
                    rel="noopener noreferrer" // Buena práctica de seguridad para enlaces externos
                >
                        Contacto
                    </a>
                </nav>
            </div>
        </header>
    );
}