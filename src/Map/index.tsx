import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const EditableMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [polygons, setPolygons] = useState<LatLngTuple[][]>([]);

  

  useEffect(() =>{
    console.log(polygons)
  }, [polygons])

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      map.setView([51.505, -0.09], 13);
    }
  }, []);

  return (
    <div>
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '400px', width: '100%' }}
        whenReady={() => {
          if (mapRef.current) {
            mapRef.current.on('ready', () => {
              mapRef.current && (mapRef.current = mapRef.current);
            });
          }
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup ref={featureGroupRef}>
          <EditControl
            position="topleft"
            draw={{
              rectangle: true,
              circle: true,
              circlemarker: false,
              marker: false,
              polyline: true,
            }}
            edit={{ featureGroup: featureGroupRef.current }}
            onCreated={(e: any) => {
            
              const layer = e.layer;
              const newLatLngs: LatLngTuple[][] = layer.getLatLngs();
              setPolygons(newLatLngs);
            }}
          />
        </FeatureGroup>
      </MapContainer>
    </div>
  );
};

export default EditableMap;
