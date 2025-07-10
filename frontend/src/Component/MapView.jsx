import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';

const BANGKOK = [13.7367, 100.5132];

// เพิ่มจังหวัดจริง (ละติจูด, ลองจิจูด) เยอะขึ้นสำหรับแต่ละสาย
const routes = {
  "เหนือ": [
    BANGKOK,
    [15.0013, 100.1181], // กำแพงเพชร
    [15.7036, 100.1367], // นครสวรรค์
    [16.4627, 99.5126],  // ตาก
    [17.3790, 99.8987],  // แม่สอด (ตาก)
    [17.8937, 99.8347],  // พิษณุโลก
    [18.2923, 99.4927],  // ลำปาง
    [18.7877, 98.9931],  // เชียงใหม่
    [19.9100, 99.8257],  // เชียงราย
  ],
  "อีสาน": [
    BANGKOK,
    [15.1208, 104.3297], // ศรีสะเกษ
    [15.8200, 104.6171], // อุบลราชธานี
    [16.4344, 103.5058], // ร้อยเอ็ด
    [17.4156, 102.7859], // ขอนแก่น
    [17.4763, 102.8292], // อุดรธานี
    [17.8868, 102.7600], // หนองคาย
    [18.4056, 104.7643], // หนองบัวลำภู
    [17.4860, 102.7876], // อุดรธานี (อีกจุด)
  ],
  "ใต้": [
    BANGKOK,
    [13.1037, 99.9305],   // เพชรบุรี
    [11.8121, 99.7769],   // ประจวบคีรีขันธ์
    [9.9583, 98.6342],    // ระนอง
    [9.1437, 99.3217],    // สุราษฎร์ธานี
    [8.4304, 99.9631],    // นครศรีธรรมราช
    [8.0864, 98.9063],    // กระบี่
    [7.8804, 98.3923],    // ภูเก็ต
    [8.4500, 98.5250],    // พังงา
    [7.5656, 99.6110],    // ตรัง
    [7.0078, 100.4761],   // สงขลา
    [6.9750, 100.5018],   // หาดใหญ่
    [6.5422, 101.2816],   // ยะลา
    [6.8704, 101.2427],   // ปัตตานี
  ],
};

// ฟังก์ชัน interpolate ตำแหน่งระหว่าง start → end
function interpolate(start, end, factor) {
  const lat = start[0] + (end[0] - start[0]) * factor;
  const lng = start[1] + (end[1] - start[1]) * factor;
  return [lat, lng];
}

const MapView = () => {
  // state เก็บตำแหน่งรถแต่ละสาย
  const [positions, setPositions] = useState({
    "เหนือ": BANGKOK,
    "อีสาน": BANGKOK,
    "ใต้": BANGKOK,
  });

  // state เก็บ index จุดเริ่มต้นของ segment และ factor ความก้าวหน้าใน segment
  const [segmentInfo, setSegmentInfo] = useState({
    "เหนือ": { index: 0, factor: 0, forward: true },
    "อีสาน": { index: 0, factor: 0, forward: true },
    "ใต้": { index: 0, factor: 0, forward: true },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const newPositions = { ...positions };
      const newSegmentInfo = { ...segmentInfo };

      for (const line of ["เหนือ", "อีสาน", "ใต้"]) {
        const path = routes[line];
        let { index, factor, forward } = segmentInfo[line];
        let nextIndex = forward ? index + 1 : index - 1;

        // ตรวจสอบขอบเขตและเปลี่ยนทิศทาง (ไป-กลับ)
        if (nextIndex >= path.length) {
          forward = false;
          nextIndex = index - 1;
        } else if (nextIndex < 0) {
          forward = true;
          nextIndex = 1;
        }

        // เพิ่ม factor ความก้าวหน้าใน segment (เลื่อนช้าๆ)
        let newFactor = factor + 0.02; // ช้า = 0.02 ต่อครั้ง (ปรับได้)
        if (newFactor >= 1) {
          index = nextIndex;
          newFactor = 0;
        }

        const current = path[index];
        const next = path[forward ? index + 1 : index - 1] || current;
        newPositions[line] = interpolate(current, next, newFactor);
        newSegmentInfo[line] = { index, factor: newFactor, forward };
      }

      setPositions(newPositions);
      setSegmentInfo(newSegmentInfo);
    }, 200); // อัพเดตทุก 200 มิลลิวินาที

    return () => clearInterval(interval);
  }, [positions, segmentInfo]);

  return (
    <MapContainer center={BANGKOK} zoom={6} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Marker รถแต่ละสาย */}
      {Object.entries(positions).map(([line, pos]) => (
        <Marker key={line} position={pos}>
          <Popup>🚚 รถสาย {line}</Popup>
        </Marker>
      ))}

      {/* เส้นทางแต่ละสาย (Polyline) */}
      {Object.entries(routes).map(([line, path]) => (
        <Polyline
          key={line}
          positions={path}
          color={line === "เหนือ" ? "blue" : line === "อีสาน" ? "green" : "red"}
          weight={3}
        />
      ))}
    </MapContainer>
  );
};

export default MapView;
