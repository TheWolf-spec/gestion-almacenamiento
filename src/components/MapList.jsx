import React from 'react';
import MapListItem from './MapListItem';
import './MapList.css';

export default function MapList({ mapas }) {
    return (
        <div className="map-list-container">
            {mapas.map(mapa => (
                <MapListItem key={mapa.id} mapa={mapa} />
            ))}
        </div>
    );
}
