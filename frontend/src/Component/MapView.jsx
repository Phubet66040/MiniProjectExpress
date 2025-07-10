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
    ใต้: [
        BANGKOK,
        [12.5652, 99.9572], // หัวหิน
        [11.8317, 99.6947], // กุยบุรี
        [11.8207, 99.8827], // ทับสะแก
        [11.7033, 99.7952], // บางสะพานน้อย
        [11.8176, 99.9028], // บางสะพาน
        [11.7884, 99.8951], // สามร้อยยอด
        [11.7821, 99.9178], // ปราณบุรี
        [9.9548, 98.5842], // กระบุรี
        [9.6635, 98.6294], // ละอุ่น
        [8.1521, 98.7507], // เหนือคลอง
        [7.9986, 99.1325], // คลองท่อม
        [7.6925, 98.9872], // อ่าวลึก
        [7.6411, 99.1243], // ปลายพระยา
        [7.4711, 98.9730], // ลำทับ
        [8.0192, 99.3102], // เขาพนม
        [7.8954, 98.3313], // กะทู้
        [7.9780, 98.3294], // ถลาง
        [8.4234, 98.4757], // ตะกั่วทุ่ง
        [8.5846, 98.4398], // ตะกั่วป่า
        [8.5176, 98.3265], // คุระบุรี
        [8.4943, 98.3958], // ทับปุด
        [8.5981, 99.7656], // ขนอม
        [8.4518, 99.9707], // ทุ่งสง
        [8.4307, 99.9926], // ท่าศาลา
        [8.4037, 99.9315], // ปากพนัง
        [8.4612, 99.9165], // ชะอวด
        [8.4553, 99.9106], // ร่อนพิบูลย์
        [8.4437, 99.9597], // สิชล
        [8.3914, 99.9561], // หัวไทร
        [8.3276, 99.9326], // ทุ่งใหญ่
        [8.4664, 99.9363], // ถ้ำพรรณ
        [8.4011, 99.9310], // นาบอน
        [8.3908, 99.9378], // จุฬาภรณ์
        [7.5413, 100.0824], // บางแก้ว
        [7.5072, 100.0127], // ควนขนุน
        [7.6191, 100.0177], // ป่าพยอม
        [7.4847, 100.1694], // เขาชัยสน
        [7.4732, 100.1295], // ป่าบอน
        [6.9035, 101.2504], // สายบุรี
        [6.5416, 101.2803], // เมืองยะลา
        [6.9886, 101.1169], // ตากใบ
        [6.9600, 101.1340], // บาเจาะ
        [6.5683, 101.2520], // สุไหงโกลก
    ],
};

const colors = {
    เหนือ: "#6366f1",
    อีสาน: "#059669",
    ใต้: "#dc2626",
};

const routeInfo = {
    เหนือ: { name: "ภาคเหนือ", emoji: "🏔️", bgColor: "bg-indigo-50", textColor: "text-indigo-700" },
    อีสาน: { name: "ภาคอีสาน", emoji: "🌾", bgColor: "bg-emerald-50", textColor: "text-emerald-700" },
    ใต้: { name: "ภาคใต้", emoji: "🏝️", bgColor: "bg-red-50", textColor: "text-red-700" },
};

const createColoredIcon = (color) =>
    new L.DivIcon({
        html: `<div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.25);
        "></div>`,
        className: "",
        iconSize: [20, 20],
        iconAnchor: [10, 10],
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

                    let newProgress = vehicle.progress + 0.015; // ปรับความเร็วให้เร็วขึ้นเล็กน้อย
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
        <div className="w-full h-screen flex flex-col bg-gradient-to-br from-slate-50 to-gray-100">
            {/* Header */}
            <div className="bg-white shadow-lg border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                                🚚 ระบบติดตามรถส่งของ
                            </h1>
                            <p className="text-gray-600 text-sm mt-1">
                                ติดตามการเดินทางของรถในแต่ละภาคแบบเรียลไทม์
                            </p>
                        </div>
                        <div className="flex gap-4">
                            {Object.entries(routeInfo).map(([key, info]) => (
                                <div key={key} className="flex items-center gap-2 text-sm">
                                    <div 
                                        className="w-4 h-4 rounded-full border-2 border-white shadow-sm"
                                        style={{ backgroundColor: colors[key] }}
                                    ></div>
                                    <span className="font-medium text-gray-700">
                                        {info.emoji} {info.name}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex">
                {/* Map Container */}
                <div className="flex-1 p-4">
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden h-full">
                        <MapContainer
                            center={BANGKOK}
                            zoom={6}
                            scrollWheelZoom={true}
                            style={{ height: "100%", width: "100%" }}
                            className="rounded-xl"
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
                                    weight={5}
                                    dashArray="10 5"
                                    opacity={0.8}
                                />
                            ))}

                            {/* จุดหยุดแต่ละสาย */}
                            {Object.entries(routes).map(([routeName, route]) =>
                                route.map((pos, idx) => (
                                    <Marker
                                        key={`${routeName}-${idx}`}
                                        position={pos}
                                        icon={createColoredIcon(colors[routeName])}
                                    >
                                        <Popup className="font-thai">
                                            <div className="text-center">
                                                <div className="font-semibold text-gray-800">
                                                    {routeInfo[routeName].emoji} {routeInfo[routeName].name}
                                                </div>
                                                <div className="text-sm text-gray-600 mt-1">
                                                    หยุดที่ {idx + 1} จาก {route.length}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {pos[0].toFixed(4)}, {pos[1].toFixed(4)}
                                                </div>
                                            </div>
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
                                            html: `<div style="
                                                font-size: 28px; 
                                                color: ${colors[routeName]};
                                                filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
                                                transform: ${vehicle.forward ? 'rotate(0deg)' : 'rotate(180deg)'};
                                            ">🚚</div>`,
                                            className: "",
                                            iconSize: [28, 28],
                                            iconAnchor: [14, 14],
                                        })
                                    }
                                >
                                    <Popup className="font-thai">
                                        <div className="text-center">
                                            <div className="font-semibold text-gray-800">
                                                🚚 รถสาย{routeInfo[routeName].name}
                                            </div>
                                            <div className="text-sm text-gray-600 mt-1">
                                                หยุดที่ {vehicle.segmentIndex + 1} จาก {routes[routeName].length}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                ความคืบหน้า: {Math.round(vehicle.progress * 100)}%
                                            </div>
                                            <div className="text-xs font-medium mt-1" style={{ color: colors[routeName] }}>
                                                {vehicle.forward ? "🔄 กำลังส่งของ" : "🔙 กำลังกลับ"}
                                            </div>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                    </div>
                </div>

                {/* Status Panel */}
                <div className="w-80 p-4">
                    <div className="bg-white rounded-xl shadow-lg h-full overflow-y-auto">
                        <div className="p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                                📊 สถานะรถทั้งหมด
                            </h2>
                            <div className="space-y-4">
                                {Object.entries(vehicles).map(([routeName, vehicle]) => {
                                    const route = routes[routeName];
                                    const currentStop = vehicle.segmentIndex + 1;
                                    const totalStops = route.length;
                                    const info = routeInfo[routeName];

                                    return (
                                        <div
                                            key={routeName}
                                            className={`${info.bgColor} p-4 rounded-xl border border-gray-200 hover:shadow-md transition-shadow`}
                                        >
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{info.emoji}</span>
                                                    <h3 className={`font-semibold ${info.textColor}`}>
                                                        {info.name}
                                                    </h3>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl">
                                                        {vehicle.forward ? "🔄" : "🔙"}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        หยุดปัจจุบัน
                                                    </span>
                                                    <span className={`font-bold ${info.textColor}`}>
                                                        {currentStop}/{totalStops}
                                                    </span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700">
                                                        ความคืบหน้า
                                                    </span>
                                                    <span className={`font-bold ${info.textColor}`}>
                                                        {Math.round(vehicle.progress * 100)}%
                                                    </span>
                                                </div>
                                                
                                                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                                    <div
                                                        className="h-3 rounded-full transition-all duration-300 ease-out"
                                                        style={{
                                                            width: `${vehicle.progress * 100}%`,
                                                            backgroundColor: colors[routeName],
                                                        }}
                                                    ></div>
                                                </div>
                                                
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-2 h-2 rounded-full animate-pulse"
                                                        style={{ backgroundColor: colors[routeName] }}
                                                    ></div>
                                                    <span className="text-xs text-gray-600">
                                                        {vehicle.forward ? "กำลังส่งของไปยังจุดหมาย" : "กำลังเดินทางกลับกรุงเทพ"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapView;