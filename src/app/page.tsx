"use client";

import { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import axios from "axios";
import "./style.css";

interface Lectura {
  NRO_MEDIDOR: string;
  NRO_CUENTA: string;
  CIU: string;
  CONSUMIDOR: string;
  CEDULA_RUC: string;
  LATITUD: number;
  LONGITUD: number;
  DIRECCION: string;
}

export default function MainPage() {
  const [lecturas, setLecturas] = useState<Lectura[]>([]);
  const [busqueda, setBusqueda] = useState<string>(""); // Para el buscador
  const [lecturasFiltradas, setLecturasFiltradas] = useState<Lectura[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://lecturagua.e-cabildoapps.com/api/auth/obtenerCoordenadas"
        );
        setLecturas(response.data?.data || []);
        setLecturasFiltradas(response.data?.data || []);
      } catch (error) {
        console.error("Error al obtener coordenadas:", error);

        // Datos de prueba mientras la API falla
        const datosPrueba: Lectura[] = [
          {
            NRO_MEDIDOR: "00001",
            NRO_CUENTA: "123",
            CIU: "1001",
            CONSUMIDOR: "Consumidor de prueba",
            CEDULA_RUC: "0101010101",
            LATITUD: -2.7801543,
            LONGITUD: -78.7616523,
            DIRECCION: "Dirección de prueba",
          },
          {
            NRO_MEDIDOR: "00002",
            NRO_CUENTA: "124",
            CIU: "1002",
            CONSUMIDOR: "Consumidor 2",
            CEDULA_RUC: "0101010102",
            LATITUD: -2.781,
            LONGITUD: -78.762,
            DIRECCION: "Otra dirección",
          },
        ];
        setLecturas(datosPrueba);
        setLecturasFiltradas(datosPrueba);
      }
    };

    fetchData();
  }, []);

  // Filtrar lecturas según la búsqueda
  useEffect(() => {
    const filtered = lecturas.filter(
      (lectura) =>
        lectura.NRO_MEDIDOR.includes(busqueda) ||
        lectura.NRO_CUENTA.includes(busqueda) ||
        lectura.CONSUMIDOR.toLowerCase().includes(busqueda.toLowerCase())
    );
    setLecturasFiltradas(filtered);
  }, [busqueda, lecturas]);

  return (
    <div className="map-container">
      {/* Logo arriba a la izquierda */}
      <img src="/paute.png" alt="Logo" className="logo" />

      {/* Buscador abajo a la derecha */}
      <div className="search-box">
        <input
          type="text"
          placeholder="Buscar por medidor, cuenta o consumidor..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* Mapa */}
      <MapComponent lecturasFiltradas={lecturasFiltradas} />
    </div>
  );
}
