import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, FeatureGroup, Polygon, Circle, Rectangle, Polyline, Popup } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';

const EditableMap: React.FC = () => {
  const mapRef = useRef<L.Map | null>(null);
  const featureGroupRef = useRef<L.FeatureGroup | null>(null);
  const [shapes, setShapes] = useState<any[]>([]);

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
              let newShape;
              switch (e.layerType) {
                case 'polygon':
                case 'polyline':
                  newShape = {
                    type: e.layerType,
                    coords: layer.getLatLngs(),
                  };
                  break;
                case 'rectangle':
                  newShape = {
                    type: e.layerType,
                    coords: [
                      [layer.getBounds().getSouthWest().lat, layer.getBounds().getSouthWest().lng],
                      [layer.getBounds().getNorthEast().lat, layer.getBounds().getNorthEast().lng],
                    ],
                  };
                  break;
                case 'circle':
                  newShape = {
                    type: e.layerType,
                    coords: [layer.getLatLng(), layer.getRadius()],
                  };
                  break;
                default:
                  break;
              }
              setShapes([...shapes, newShape]);
            }}
            
          />
        </FeatureGroup>
        {shapes.map((shape, index) => {
          switch (shape.type) {
            case 'polygon':
              return (
                <FeatureGroup key={index}>
                  <Polygon positions={shape.coords}>
                    <Popup>Editable Polygon {index + 1}</Popup>
                  </Polygon>
                </FeatureGroup>
              );
            case 'rectangle':
              return (
                <FeatureGroup key={index}>
                  <Rectangle bounds={shape.coords}>
                    <Popup>Editable Rectangle {index + 1}</Popup>
                  </Rectangle>
                </FeatureGroup>
              );
            case 'circle':
              return (
                <FeatureGroup key={index}>
                  <Circle center={shape.coords[0]} radius={shape.coords[1]} />
                  <Popup>Editable Circle {index + 1}</Popup>
                </FeatureGroup>
              );
            case 'polyline':
              return (
                <FeatureGroup key={index}>
                  <Polyline positions={shape.coords}>
                    <Popup>Editable Polyline {index + 1}</Popup>
                  </Polyline>
                </FeatureGroup>
              );
            default:
              return null;
          }
        })}
      </MapContainer>
    </div>
  );
};

export default EditableMap;