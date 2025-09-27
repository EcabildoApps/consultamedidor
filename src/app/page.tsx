"use client";

import { useEffect, useState } from "react";
import MapComponent from "./MapComponent";
import axios from "axios";
import "./style.css";
import Image from 'next/image';

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

      <Image
        src="/paute.png"
        alt="Logo"
        className= "logo"
        width={500}
        height={300}
      />

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
