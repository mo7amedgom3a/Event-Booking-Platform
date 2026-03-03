import { Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix marker icon issue in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export const LocationPicker = ({ position, setPosition }: { position: {lat: number, lng: number}, setPosition: (pos: {lat: number, lng: number}) => void }) => {
  useMapEvents({
    click(e) {
      setPosition({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return position.lat && position.lng ? <Marker position={[position.lat, position.lng]} /> : null;
};
