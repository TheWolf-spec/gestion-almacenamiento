import { Routes, Route } from 'react-router-dom';
import InicioPage from './pages/InicioPage';
import MapaPage from './pages/MapaPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioPage />} />
      <Route path="/mapa/:mapaId" element={<MapaPage />} />
    </Routes>
  );
}

export default App;