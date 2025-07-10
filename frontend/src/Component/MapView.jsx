import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// แก้ปัญหา icon หายใน leaflet + React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon-2x.png",
    iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-icon.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/images/marker-shadow.png",
});

const BANGKOK = [13.7367, 100.5132];

const routes = {
    เหนือ: [
        BANGKOK,
        [15.0013, 100.1181], // กำแพงเพชร
        [15.7036, 100.1367], // นครสวรรค์
        [16.4627, 99.5126], // ตาก
        [17.379, 99.8987], // แม่สอด
        [17.8937, 99.8347], // พิษณุโลก
        [18.2923, 99.4927], // ลำปาง
        [18.7877, 98.9931], // เชียงใหม่
        [19.91, 99.8257], // เชียงราย
    ],
    อีสาน: [
        BANGKOK,
        [15.1208, 104.3297], // ศรีสะเกษ
        [15.82, 104.6171], // อุบลราชธานี
        [16.4344, 103.5058], // ร้อยเอ็ด
        [17.4156, 102.7859], // ขอนแก่น
        [17.4763, 102.8292], // อุดรธานี
        [17.8868, 102.76], // หนองคาย
    ],
    "ใต้": [
        [13.7367, 100.5132], // กรุงเทพ (ต้นทาง)

        // ประจวบคีรีขันธ์ (เรียงจากเหนือลงใต้)
        [12.5652, 99.9572],  // หัวหิน
        [11.8317, 99.6947],  // กุยบุรี
        [11.8207, 99.8827],  // ทับสะแก
        [11.7033, 99.7952],  // บางสะพานน้อย
        [11.8176, 99.9028],  // บางสะพาน
        [11.7884, 99.8951],  // สามร้อยยอด
        [11.7821, 99.9178],  // ปราณบุรี

        // ระนอง
        [9.9548, 98.5842],   // กระบุรี
        [9.6635, 98.6294],   // ละอุ่น

        // กระบี่
        [8.1521, 98.7507],   // เหนือคลอง
        [7.9986, 99.1325],   // คลองท่อม
        [7.6925, 98.9872],   // อ่าวลึก
        [7.6411, 99.1243],   // ปลายพระยา
        [7.4711, 98.9730],   // ลำทับ
        [8.0192, 99.3102],   // เขาพนม

        // ภูเก็ต
        [7.8954, 98.3313],   // กะทู้
        [7.9780, 98.3294],   // ถลาง

        // พังงา
        [8.4234, 98.4757],   // ตะกั่วทุ่ง
        [8.5846, 98.4398],   // ตะกั่วป่า
        [8.5176, 98.3265],   // คุระบุรี
        [8.4943, 98.3958],   // ทับปุด

        // นครศรีธรรมราช (เรียงกลาง → ใต้)
        [8.5981, 99.7656],   // ขนอม
        [8.4518, 99.9707],   // ทุ่งสง
        [8.4307, 99.9926],   // ท่าศาลา
        [8.4037, 99.9315],   // ปากพนัง
        [8.4612, 99.9165],   // ชะอวด
        [8.4553, 99.9106],   // ร่อนพิบูลย์
        [8.4437, 99.9597],   // สิชล
        [8.3914, 99.9561],   // หัวไทร
        [8.3276, 99.9326],   // ทุ่งใหญ่
        [8.4664, 99.9363],   // ถ้ำพรรณ
        [8.4011, 99.9310],   // นาบอน
        [8.3908, 99.9378],   // จุฬาภรณ์

        // พัทลุง
        [7.5413, 100.0824],  // บางแก้ว
        [7.5072, 100.0127],  // ควนขนุน
        [7.6191, 100.0177],  // ป่าพยอม
        [7.4847, 100.1694],  // เขาชัยสน
        [7.4732, 100.1295],  // ป่าบอน

        // ปัตตานี
        [6.9035, 101.2504],  // สายบุรี

        // ยะลา
        [6.5416, 101.2803],  // เมืองยะลา

        // นราธิวาส
        [6.9886, 101.1169],  // ตากใบ
        [6.9600, 101.1340],  // บาเจาะ
        [6.5683, 101.2520],  // สุไหงโกลก
    ],
};

const colors = {
    เหนือ: "#3b82f6",
    อีสาน: "#10b981",
    ใต้: "#ef4444",
};
const createColoredIcon = (color) =>
    new L.DivIcon({
        html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 4px rgba(0,0,0,0.3);
    "></div>`,
        className: "",
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });


// interpolate ระหว่างสองจุด
function interpolate(start, end, factor) {
    const lat = start[0] + (end[0] - start[0]) * factor;
    const lng = start[1] + (end[1] - start[1]) * factor;
    return [lat, lng];
}

const MapView = () => {
    const [vehicles, setVehicles] = useState({
        เหนือ: { segmentIndex: 0, progress: 0, forward: true, currentPos: BANGKOK },
        อีสาน: { segmentIndex: 0, progress: 0, forward: true, currentPos: BANGKOK },
        ใต้: { segmentIndex: 0, progress: 0, forward: true, currentPos: BANGKOK },
    });

    useEffect(() => {
        const interval = setInterval(() => {
            setVehicles((prev) => {
                const newVehicles = { ...prev };
                Object.keys(routes).forEach((routeName) => {
                    const route = routes[routeName];
                    const vehicle = newVehicles[routeName];

                    let newProgress = vehicle.progress + 0.01; // ปรับความเร็วได้ตรงนี้
                    let newSegmentIndex = vehicle.segmentIndex;
                    let newForward = vehicle.forward;

                    if (newProgress >= 1) {
                        newProgress = 0;
                        if (newForward) {
                            newSegmentIndex++;
                            if (newSegmentIndex >= route.length - 1) {
                                newForward = false;
                                newSegmentIndex = route.length - 2;
                            }
                        } else {
                            newSegmentIndex--;
                            if (newSegmentIndex < 0) {
                                newForward = true;
                                newSegmentIndex = 0;
                            }
                        }
                    }

                    const startPoint = route[newSegmentIndex];
                    const endPoint = route[newSegmentIndex + (newForward ? 1 : -1)] || startPoint;
                    const currentPos = interpolate(startPoint, endPoint, newProgress);

                    newVehicles[routeName] = {
                        segmentIndex: newSegmentIndex,
                        progress: newProgress,
                        forward: newForward,
                        currentPos,
                    };
                });
                return newVehicles;
            });
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-screen flex flex-col">
            {/* Header */}
            <div className="p-4 bg-white shadow border-b">
                <h1 className="text-2xl font-bold">🇹🇭 Thailand Delivery Routes - Live Tracking</h1>
            </div>

            {/* Leaflet Map */}
            <div className="flex-1">
                <MapContainer
                    center={BANGKOK}
                    zoom={6}
                    scrollWheelZoom={true}
                    style={{ height: "100%", width: "100%" }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* เส้นทางแต่ละสาย */}
                    {Object.entries(routes).map(([routeName, route]) => (
                        <Polyline
                            key={routeName}
                            positions={route}
                            color={colors[routeName]}
                            weight={4}
                            dashArray="8 4"
                            opacity={0.7}
                        />
                    ))}

                    {/* จุดหยุดแต่ละสาย */}
                    {Object.entries(routes).map(([routeName, route]) =>
                        route.map((pos, idx) => (
                            <Marker
                                key={`${routeName}-${idx}`}
                                position={pos}
                                icon={createColoredIcon(colors[routeName])} // <-- ใช้ไอคอนสีตามภาค
                            >
                                <Popup>
                                    {routeName} - หยุดที่ {idx + 1}
                                    <br />
                                    ละติจูด: {pos[0].toFixed(4)}, ลองจิจูด: {pos[1].toFixed(4)}
                                </Popup>
                            </Marker>
                        ))
                    )}

                    {/* รถแต่ละสาย */}
                    {Object.entries(vehicles).map(([routeName, vehicle]) => (
                        <Marker
                            key={`vehicle-${routeName}`}
                            position={vehicle.currentPos}
                            icon={
                                new L.DivIcon({
                                    html: `<div style="font-size: 24px; color: ${colors[routeName]}">🚚</div>`,
                                    className: "",
                                    iconSize: [24, 24],
                                    iconAnchor: [12, 12],
                                })
                            }
                        >
                            <Popup>
                                รถสาย{routeName} <br />
                                หยุดที่ {vehicle.segmentIndex + 1} <br />
                                ความคืบหน้า: {Math.round(vehicle.progress * 100)}% <br />
                                สถานะ: {vehicle.forward ? "กำลังส่งของ" : "กำลังกลับ"}
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>

            {/* Status Panel */}
            <div className="bg-white border-t p-4 shadow-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {Object.entries(vehicles).map(([routeName, vehicle]) => {
                        const route = routes[routeName];
                        const currentStop = vehicle.segmentIndex + 1;
                        const totalStops = route.length;
                        const direction = vehicle.forward ? "→" : "←";

                        return (
                            <div
                                key={routeName}
                                className="bg-gray-50 p-4 rounded-lg shadow-sm border"
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-semibold text-gray-800 text-base">
                                        🚚 รถสาย{routeName}
                                    </h3>
                                    <span className="text-2xl animate-pulse">{direction}</span>
                                </div>
                                <div className="text-gray-600 text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span>หยุดที่:</span>
                                        <span className="font-semibold">
                                            {currentStop}/{totalStops}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>ความคืบหน้า:</span>
                                        <span className="font-semibold">
                                            {Math.round(vehicle.progress * 100)}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                        <div
                                            className="h-3 rounded-full transition-all duration-100"
                                            style={{
                                                width: `${vehicle.progress * 100}%`,
                                                backgroundColor: colors[routeName],
                                            }}
                                        ></div>
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                        สถานะ: {vehicle.forward ? "กำลังส่งของ" : "กำลังกลับ"}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MapView;
