'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';
import L from 'leaflet';

// Fix Leaflet marker icon issue in Next.js
const fixLeafletMarker = () => {
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon-2x.png',
      iconUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-icon.png',
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/marker-shadow.png',
    });
  }
};

interface MapProps {
  position: [number, number];
  popupText?: string;
  zoom?: number;
}

export default function Map({ position, popupText, zoom = 16 }: MapProps) {
  useEffect(() => {
    fixLeafletMarker();
  }, []);

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border z-[400]">
      <MapContainer
        center={position}
        zoom={zoom}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          {popupText && <Popup>{popupText}</Popup>}
        </Marker>
      </MapContainer>
    </div>
  );
}
