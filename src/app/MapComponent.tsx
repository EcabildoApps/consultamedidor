"use client";

import React, { useEffect, useRef } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Lectura {
  LATITUD: number;
  LONGITUD: number;
  CONSUMIDOR: string;
  DIRECCION: string;
}

interface Props {
  lecturasFiltradas: Lectura[];
}

const MapComponent: React.FC<Props> = ({ lecturasFiltradas }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Inicializar mapa solo una vez
    if (!mapRef.current) {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: [
                "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
                "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
              ],
              tileSize: 256,
            },
          },
          layers: [
            {
              id: "osm-layer",
              type: "raster",
              source: "osm",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center:
          lecturasFiltradas.length > 0
            ? [lecturasFiltradas[0].LONGITUD, lecturasFiltradas[0].LATITUD]
            : [-78.761515, -2.780189],
        zoom: 13,
      });

      map.addControl(new maplibregl.NavigationControl(), "top-right");

      mapRef.current = map;
    }

    const map = mapRef.current;

    // Limpiar marcador previo
    if (markerRef.current) {
      markerRef.current.remove();
    }

    // Usar la primera lectura para colocar el marcador rojo
    if (lecturasFiltradas.length > 0) {
      const { LATITUD: lat, LONGITUD: lng, CONSUMIDOR, DIRECCION } =
        lecturasFiltradas[0];

      markerRef.current = new maplibregl.Marker({ color: "red", draggable: false })
        .setLngLat([lng, lat])
        .setPopup(
          new maplibregl.Popup().setHTML(
            `<b>${CONSUMIDOR}</b><br>${DIRECCION}<br>Lat: ${lat}<br>Lng: ${lng}`
          )
        )
        .addTo(map);

      // Centrar mapa en el marcador
      map.flyTo({ center: [lng, lat], zoom: 16 });
    }
  }, [lecturasFiltradas]);

  return (
    <div style={{ position: "relative", width: "100%", height: "100vh" }}>
      <div
        ref={mapContainerRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    </div>
  );
};

export default MapComponent;
