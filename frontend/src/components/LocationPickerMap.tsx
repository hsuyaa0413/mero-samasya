// components/LocationPickerMap.tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  useMapEvents,
} from 'react-leaflet';
import L, { LatLng, LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios'; // For API calls within the component
import { LocateFixed } from 'lucide-react';
import { backendApi } from '@/lib/constant';

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

const DEFAULT_CENTER: LatLngExpression = [26.82188, 87.28867];
const DEFAULT_ZOOM = 13;

interface LocationPickerMapProps {
  onLocationSelect: (
    lat: number,
    lng: number,
    address: string,
    autoFill?: boolean
  ) => void;
  typedLocation: string; // Location text from the input field
  initialCoordinates?: { lat: number; lng: number }; // For editing existing entries
}

// Debounce function
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> =>
    new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
};

const MapUpdater = ({
  center,
  zoom,
}: {
  center: LatLngExpression;
  zoom: number;
}) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
};

// Default export
const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  onLocationSelect,
  typedLocation,
  initialCoordinates,
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLng | null>(
    initialCoordinates
      ? new LatLng(initialCoordinates.lat, initialCoordinates.lng)
      : null
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(
    initialCoordinates
      ? [initialCoordinates.lat, initialCoordinates.lng]
      : DEFAULT_CENTER
  );
  const [mapZoom, setMapZoom] = useState(
    initialCoordinates ? 15 : DEFAULT_ZOOM
  );
  const [currentAddress, setCurrentAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mapMessage, setMapMessage] = useState<string>(
    'Interactive map loading...'
  );

  const mapRef = useRef<L.Map>(null);
  const isMounted = useRef(false); // To prevent initial effect runs if not desired

  // Reverse Geocode (Coordinates -> Address)
  const reverseGeocode = useCallback(
    async (lat: number, lng: number, autoFillInput: boolean = true) => {
      setIsLoading(true);
      setMapMessage('Fetching address...');
      try {
        const response = await axios.get(
          `${backendApi}/report/reverse-geocode`,
          {
            params: { lat, lon: lng },
          }
        );
        const { address } = response.data;
        setCurrentAddress(address);
        onLocationSelect(lat, lng, address, autoFillInput);
        setMapMessage('Click on the map to pin the exact location or use GPS.');
      } catch (error) {
        console.error('Reverse geocoding error:', error);
        setCurrentAddress('Could not fetch address.');
        setMapMessage('Could not fetch address. Try again.');
        // Optionally, still call onLocationSelect with just coords if address fails
        onLocationSelect(lat, lng, 'Address not found', autoFillInput);
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect]
  );

  // Geocode (Address -> Coordinates)
  const geocodeAddress = useCallback(
    async (address: string) => {
      if (!address || address.length < 3) return; // Min length to avoid too many requests
      setIsLoading(true);
      setMapMessage(`Searching for "${address}"...`);
      try {
        const response = await axios.get(`${backendApi}/report/geocode`, {
          params: { q: address },
        });
        const { lat, lon, displayName } = response.data;
        const newPos = new LatLng(lat, lon);
        setMarkerPosition(newPos);
        setMapCenter([lat, lon]);
        setMapZoom(16);
        setCurrentAddress(displayName);
        onLocationSelect(lat, lon, displayName, false); // Don't autoFill here to avoid loop, form already has the text
        setMapMessage('Location found. You can refine by clicking the map.');
      } catch (error) {
        console.error('Geocoding error:', error);
        setMapMessage(
          `Could not find "${address}". Try a different search or click the map.`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [onLocationSelect]
  );

  const debouncedGeocodeAddress = useCallback(debounce(geocodeAddress, 1000), [
    geocodeAddress,
  ]);

  // Effect for initial load / initialCoordinates
  useEffect(() => {
    if (initialCoordinates && !markerPosition) {
      const initialPos = new LatLng(
        initialCoordinates.lat,
        initialCoordinates.lng
      );
      setMarkerPosition(initialPos);
      setMapCenter([initialCoordinates.lat, initialCoordinates.lng]);
      setMapZoom(15);
      reverseGeocode(initialCoordinates.lat, initialCoordinates.lng, true);
    }
    isMounted.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCoordinates]); // Only on initialCoordinates change

  // Effect for typedLocation changes (from input field)
  useEffect(() => {
    if (!isMounted.current) return; // Wait for mount to avoid running on initial render with empty typedLocation
    if (typedLocation && typedLocation !== currentAddress) {
      // Avoid re-geocoding if address is from map click
      debouncedGeocodeAddress(typedLocation);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [typedLocation]); // Note: debouncedGeocodeAddress is memoized

  const MapEvents = () => {
    const map = useMap(); // Hook to get map instance
    useMapEvents({
      click(e) {
        setMarkerPosition(e.latlng);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
      },
      locationfound(e) {
        setMarkerPosition(e.latlng);
        map.flyTo(e.latlng, 16);
        reverseGeocode(e.latlng.lat, e.latlng.lng);
        setMapMessage('Location found via GPS.');
      },
      locationerror(e) {
        console.error('Location error:', e);
        setMapMessage(
          'Could not access your location. Please enable location services.'
        );
        setIsLoading(false);
      },
    });
    return null;
  };

  const handleLocateGPS = () => {
    if (!navigator.geolocation) return;
    setIsLoading(true);
    setMapMessage('Attempting to get your GPS location...');
    // mapRef.current?.locate();
    navigator.geolocation.getCurrentPosition(
      pos => {
        const newPos = new LatLng(pos.coords.latitude, pos.coords.longitude);
        setMarkerPosition(newPos);
        setMapCenter([pos.coords.latitude, pos.coords.longitude]);
        setMapZoom(15);
        reverseGeocode(pos.coords.latitude, pos.coords.longitude, true);
        setMapMessage('Location found via GPS.');
        setIsLoading(false);
      },
      err => {
        console.error('Geolocation error:', err);
        setMapMessage(`Failed to retrieve location: ${err.message}`);
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
      }
    );
  };

  return (
    <div className="bg-lightBlue-75 rounded-md p-4 relative h-72 md:h-96">
      {/* Increased height */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%', borderRadius: '0.375rem' }}
        whenReady={() => {
          // This callback is invoked when the map is initialized.
          // At this point, mapRef.current should be set.
          // You can perform actions here that depend on the map being ready,
          // though often useEffect hooks reacting to mapRef.current are also used.
          if (mapRef.current) {
            // console.log('Map is ready. Instance obtained via ref:', mapRef.current);
            // Example: If you had an initial action to perform on the map
            mapRef.current.setZoom(10); // Just an example
          } else {
            // This case should ideally not happen if react-leaflet's ref handling is correct
            // console.error('Map is ready, but mapRef.current is still null.');
          }
        }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {markerPosition && (
          <Marker position={markerPosition}>
            <Popup>
              {isLoading
                ? 'Loading...'
                : currentAddress ||
                  `Lat: ${markerPosition.lat.toFixed(
                    5
                  )}, Lng: ${markerPosition.lng.toFixed(5)}`}
            </Popup>
          </Marker>
        )}
        <MapEvents />
        <MapUpdater center={mapCenter} zoom={mapZoom} />
      </MapContainer>

      <div className="absolute top-2 right-2 z-[401]">
        {/* Ensure z-index is above map tiles */}
        <button
          type="button"
          onClick={handleLocateGPS}
          className="bg-white p-1.5 rounded-full shadow-sm hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
          title="Use GPS to detect your location"
          disabled={isLoading}
        >
          <LocateFixed className="text-red-500 size-5" />
        </button>
      </div>

      <div className="absolute bottom-8 left-0 right-0 px-4 z-[401]">
        {/* Ensure z-index is above map tiles */}
        <div className="bg-white/80 text-xs p-2 rounded-md text-center shadow-sm">
          {isLoading ? mapMessage : currentAddress || mapMessage}
        </div>
      </div>
    </div>
  );
};

export default LocationPickerMap;
