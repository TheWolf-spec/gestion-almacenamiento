
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
                <a 
                    href="https://wa.me/+59164707579" 
                    className="nav-link"
                    target="_blank" 
                    rel="noopener noreferrer" 
                >
                        Contacto
                    </a>
                </nav>
            </div>
        </header>
    );
}