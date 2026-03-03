import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface EventLocationMapProps {
  lat: number;
  lng: number;
}

export const EventLocationMap = ({ lat, lng }: EventLocationMapProps) => (
  <MapContainer center={[lat, lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
    <TileLayer
      attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
    />
    <TileLayer
      url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
    />
    <Marker position={[lat, lng]} />
  </MapContainer>
);
