
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const routes = {
  "เหนือ": [
    [18.7877, 98.9931], // เชียงใหม่
    [18.2923, 99.4927], // ลำปาง
    [19.0293, 99.9013]  // พะเยา
  ],
  "อีสาน": [
    [17.1495, 104.1477], // สกลนคร
    [17.4156, 102.7859], // ขอนแก่น
    [17.418, 104.778]    // นครพนม
  ],
  "ใต้": [
    [7.8804, 98.3923],   // ภูเก็ต
    [8.4304, 99.9631],   // นครศรีธรรมราช
    [6.5422, 101.2816]   // ยะลา
  ]
};

const MapView = () => {
  const [truckPos, setTruckPos] = useState(routes["เหนือ"][0]);
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(i => {
        const next = (i + 1) % routes["เหนือ"].length;
        setTruckPos(routes["เหนือ"][next]);
        return next;
      });
    }, 3000); 
    return () => clearInterval(interval);
  }, []);

  return (
    <MapContainer center={[16, 100]} zoom={6} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

     
      <Marker position={truckPos}>
        <Popup>🚚 รถจำลองสายเหนือ</Popup>
      </Marker>

     
      <Polyline positions={routes["เหนือ"]} color="blue" />
      <Polyline positions={routes["อีสาน"]} color="green" />
      <Polyline positions={routes["ใต้"]} color="red" />
    </MapContainer>
  );
};

export default MapView;
