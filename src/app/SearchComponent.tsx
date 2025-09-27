import React, { useState } from 'react';

// Definimos la interfaz para una "lectura"
interface Lectura {
  NRO_CUENTA: string;
}

interface SearchComponentProps {
  lecturas: Lectura[];  // Usamos el tipo Lectura[] en lugar de any[]
  onSearch: (filteredLecturas: Lectura[]) => void; // Cambiamos a Lectura[]
}

const SearchComponent: React.FC<SearchComponentProps> = ({ lecturas, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtrarLecturas = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valorBusqueda = event.target.value.trim().toLowerCase();
    setSearchTerm(valorBusqueda);

    if (!valorBusqueda) {
      onSearch(lecturas); // Si no hay texto en el campo, mostramos todas las lecturas
    } else {
      // Filtrar las lecturas según el NRO_CUENTA
      const lecturasFiltradas = lecturas.filter((lectura) =>
        lectura.NRO_CUENTA.toString().includes(valorBusqueda)
      );
      onSearch(lecturasFiltradas);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        placeholder="Buscar por NRO_CUENTA"
        onChange={filtrarLecturas}
      />
    </div>
  );
};

export default SearchComponent;
