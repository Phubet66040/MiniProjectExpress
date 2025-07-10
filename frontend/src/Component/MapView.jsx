import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';

// 📍 จุดเริ่มต้น: กรุงเทพฯ ปากคลอง
const BANGKOK = [13.7367, 100.5132];

// 🛣️ เส้นทางแต่ละสาย (รวมกรุงเทพด้านหน้า)
const routes = {
  "เหนือ": [
    BANGKOK,
    [15.0300, 100.9000], // นครสวรรค์
    [16.4171, 99.5192],  // ตาก
    [18.2923, 99.4927],  // ลำปาง
    [18.7877, 98.9931]   // เชียงใหม่
  ],
  "อีสาน": [
    BANGKOK,
    [15.1238, 104.3297], // ศรีสะเกษ
    [16.4322, 103.5058], // ร้อยเอ็ด
    [17.4156, 102.7859], // ขอนแก่น
    [17.4860, 102.7876]  // อุดรธานี
  ],
  "ใต้": [
    BANGKOK,
    [9.1449, 99.3210],   // สุราษฎร์ธานี
    [8.4304, 99.9631],   // นครศรีธรรมราช
    [7.8804, 98.3923],   // ภูเก็ต
    [6.5422, 101.2816]   // ยะลา
  ]
};

// 🔧 ฟังก์ชัน Interpolate ตำแหน่งระหว่าง A→B
function interpolate(start, end, factor) {
  const lat = start[0] + (end[0] - start[0]) * factor;
  const lng = start[1] + (end[1] - start[1]) * factor;
  return [lat, lng];
}

const MapView = () => {
  const [positions, setPositions] = useState({
    "เหนือ": BANGKOK,
    "อีสาน": BANGKOK,
    "ใต้": BANGKOK,
  });

  const [state, setState] = useState({
    "เหนือ": { index: 0, factor: 0, forward: true },
    "อีสาน": { index: 0, factor: 0, forward: true },
    "ใต้": { index: 0, factor: 0, forward: true }
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newPositions = { ...positions };
      const newState = { ...state };

      for (const line of ["เหนือ", "อีสาน", "ใต้"]) {
        const path = routes[line];
        let { index, factor, forward } = state[line];
        let nextIndex = forward ? index + 1 : index - 1;

        // ไปถึงปลายทาง → กลับ
        if (nextIndex >= path.length) {
          forward = false;
          nextIndex = index - 1;
        } else if (nextIndex < 0) {
          forward = true;
          nextIndex = 1;
        }

        factor += 0.01; // ❗ ค่อย ๆ ขยับ (ช้า)
        if (factor >= 1) {
          index = nextIndex;
          factor = 0;
        }

        const current = path[index];
        const next = path[forward ? index + 1 : index - 1] || current;
        newPositions[line] = interpolate(current, next, factor);
        newState[line] = { index, factor, forward };
      }

      setPositions(newPositions);
      setState(newState);
    }, 300); // ❗ เคลื่อนที่ทุก 300ms

    return () => clearInterval(interval);
  }, [positions, state]);

  return (
    <MapContainer center={BANGKOK} zoom={6} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* แสดงรถแต่ละสาย */}
      {Object.entries(positions).map(([line, pos], idx) => (
        <Marker key={idx} position={pos}>
          <Popup>🚛 รถสาย {line}</Popup>
        </Marker>
      ))}

      {/* วาดเส้นทาง */}
      {Object.entries(routes).map(([line, path], idx) => (
        <Polyline
          key={idx}
          positions={path}
          color={line === "เหนือ" ? "blue" : line === "อีสาน" ? "green" : "red"}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
