import React, { useState, useEffect } from 'react';

const DashboardCard = ({ title, value, icon, bgColor, status, subValue, trend }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
        if (typeof value === 'number') {
            const duration = 800;
            const steps = 30;
            const increment = value / steps;
            let current = 0;
            
            const timer = setInterval(() => {
                current += increment;
                if (current >= value) {
                    setDisplayValue(value);
                    clearInterval(timer);
                } else {
                    setDisplayValue(Math.floor(current));
                }
            }, duration / steps);
            
            return () => clearInterval(timer);
        } else {
            setDisplayValue(value);
        }
    }, [value]);

    const getStatusColor = () => {
        switch (status) {
            case 'success': return 'text-green-600';
            case 'warning': return 'text-yellow-600';
            case 'danger': return 'text-red-600';
            case 'info': return 'text-blue-600';
            default: return 'text-gray-600';
        }
    };

    const getStatusBg = () => {
        switch (status) {
            case 'success': return 'bg-green-50 border-green-200';
            case 'warning': return 'bg-yellow-50 border-yellow-200';
            case 'danger': return 'bg-red-50 border-red-200';
            case 'info': return 'bg-blue-50 border-blue-200';
            default: return 'bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className={`
            relative p-6 rounded-2xl shadow-lg border-2 
            transform transition-all duration-300 ease-out
            hover:shadow-xl hover:scale-105 hover:-translate-y-1
            ${getStatusBg()}
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}
        `}>
            {/* Status Indicator */}
            <div className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
                status === 'success' ? 'bg-green-500' :
                status === 'warning' ? 'bg-yellow-500' :
                status === 'danger' ? 'bg-red-500' :
                'bg-blue-500'
            } animate-pulse`}></div>
            
            {/* Icon */}
            <div className={`text-4xl mb-4 ${getStatusColor()}`}>
                {icon}
            </div>
            
            {/* Title */}
            <h3 className="text-gray-700 text-sm font-semibold mb-2 uppercase tracking-wide">
                {title}
            </h3>
            
            {/* Value */}
            <div className="mb-2">
                <p className={`text-3xl font-bold leading-tight ${getStatusColor()}`}>
                    {typeof displayValue === 'number' ? displayValue.toLocaleString() : displayValue}
                </p>
                {subValue && (
                    <p className="text-sm text-gray-500 mt-1">{subValue}</p>
                )}
            </div>
            
            {/* Trend */}
            {trend && (
                <div className="flex items-center gap-1 text-sm">
                    <span className={trend > 0 ? 'text-green-600' : 'text-red-600'}>
                        {trend > 0 ? '📈' : '📉'}
                    </span>
                    <span className="text-gray-600">
                        {trend > 0 ? '+' : ''}{trend}% จากเมื่อวาน
                    </span>
                </div>
            )}
        </div>
    );
};

const TruckStatusTable = ({ trucks }) => {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                🚛 สถานะรถปัจจุบัน
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-left p-3 font-semibold text-gray-700">เลขทะเบียน</th>
                            <th className="text-left p-3 font-semibold text-gray-700">สถานะ</th>
                            <th className="text-left p-3 font-semibold text-gray-700">เวลา</th>
                            <th className="text-left p-3 font-semibold text-gray-700">ประเภท</th>
                            <th className="text-left p-3 font-semibold text-gray-700">จุดหมาย</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trucks.map((truck, index) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-medium text-gray-800">{truck.license}</td>
                                <td className="p-3">
                                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                        truck.status === 'เข้าโกดัง' ? 'bg-green-100 text-green-800' :
                                        truck.status === 'ออกโกดัง' ? 'bg-blue-100 text-blue-800' :
                                        truck.status === 'กำลังขนถ่าย' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {truck.status}
                                    </span>
                                </td>
                                <td className="p-3 text-gray-600">{truck.time}</td>
                                <td className="p-3 text-gray-600">{truck.type}</td>
                                <td className="p-3 text-gray-600">{truck.destination}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const WarehouseDashboard = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const refreshTimer = setInterval(() => {
            setRefreshKey(prev => prev + 1);
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(refreshTimer);
    }, []);

    // Generate dynamic data
    const getRandomValue = (base, variance) => {
        return Math.max(0, base + Math.floor(Math.random() * variance) - variance/2);
    };

    const totalTrucks = getRandomValue(15, 6);
    const trucksInside = getRandomValue(8, 4);
    const trucksLoading = getRandomValue(3, 2);
    const waitingTrucks = getRandomValue(4, 3);

    const dashboardData = [
        {
            title: "รถทั้งหมด",
            value: totalTrucks,
            icon: "🚛",
            status: "info",
            subValue: "คัน (วันนี้)",
            trend: getRandomValue(5, 10) - 5
        },
        {
            title: "รถในโกดัง",
            value: trucksInside,
            icon: "🏭",
            status: "success",
            subValue: "คัน (ขณะนี้)",
            trend: getRandomValue(3, 6) - 3
        },
        {
            title: "กำลังขนถ่าย",
            value: trucksLoading,
            icon: "⏳",
            status: "warning",
            subValue: "คัน (ดำเนินการ)",
            trend: getRandomValue(2, 4) - 2
        },
        {
            title: "รอเข้าคิว",
            value: waitingTrucks,
            icon: "⏰",
            status: waitingTrucks > 5 ? "danger" : "info",
            subValue: "คัน (รอคิว)",
            trend: getRandomValue(1, 6) - 3
        }
    ];

    const recentTrucks = [
        { license: "กข-1234", status: "เข้าโกดัง", time: "14:30", type: "รถบรรทุก 6 ล้อ", destination: "เชียงใหม่" },
        { license: "กก-5678", status: "กำลังขนถ่าย", time: "14:15", type: "รถบรรทุก 10 ล้อ", destination: "เชียงใหม่" },
        { license: "ขค-9012", status: "ออกโกดัง", time: "14:00", type: "รถกึ่งพ่วง", destination: "อุดรราชธานี" },
        { license: "คง-3456", status: "เข้าโกดัง", time: "13:45", type: "รถบรรทุก 6 ล้อ", destination: "สกลนคร" },
        { license: "งจ-7890", status: "กำลังขนถ่าย", time: "13:30", type: "รถบรรทุก 10 ล้อ", destination: "ยะลา" }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3">
                                🏭 ระบบจัดการรถเข้า-ออกโกดัง
                            </h1>
                            <p className="text-gray-600">
                                ติดตามและจัดการการเข้า-ออกของรถบรรทุกในโกดังแบบเรียลไทม์
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0 text-right">
                            <div className="text-2xl font-bold text-gray-800">
                                {currentTime.toLocaleTimeString('th-TH')}
                            </div>
                            <div className="text-sm text-gray-600">
                                {currentTime.toLocaleDateString('th-TH', { 
                                    weekday: 'long', 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dashboard Cards */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {dashboardData.map((card, index) => (
                        <div 
                            key={`${card.title}-${refreshKey}`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <DashboardCard
                                title={card.title}
                                value={card.value}
                                icon={card.icon}
                                status={card.status}
                                subValue={card.subValue}
                                trend={card.trend}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="max-w-7xl mx-auto mb-8">
                <TruckStatusTable trucks={recentTrucks} />
            </div>

            {/* Quick Stats */}
            <div className="max-w-7xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            📊 สถิติวันนี้
                        </h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">รถเข้าแล้ว</span>
                                <span className="font-bold text-green-600">{getRandomValue(25, 8)} คัน</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">รถออกแล้ว</span>
                                <span className="font-bold text-blue-600">{getRandomValue(20, 6)} คัน</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-gray-600">เวลาขนถ่ายเฉลี่ย</span>
                                <span className="font-bold text-gray-800">{getRandomValue(45, 15)} นาที</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            ⚡ ประสิทธิภาพ
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">อัตราการใช้งาน</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {getRandomValue(85, 15)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-blue-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${getRandomValue(85, 15)}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-sm text-gray-600">ความพึงพอใจ</span>
                                    <span className="text-sm font-semibold text-gray-800">
                                        {getRandomValue(92, 8)}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className="bg-green-500 h-2 rounded-full transition-all duration-1000"
                                        style={{ width: `${getRandomValue(92, 8)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            🔔 การแจ้งเตือน
                        </h3>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                                <span className="text-yellow-600">⚠️</span>
                                <span className="text-sm text-gray-700">
                                    รถคิวยาว {waitingTrucks} คัน
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <span className="text-blue-600">ℹ️</span>
                                <span className="text-sm text-gray-700">
                                    ระบบทำงานปกติ
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Refresh Button */}
            <div className="max-w-7xl mx-auto text-center">
                <button
                    onClick={() => setRefreshKey(prev => prev + 1)}
                    className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 shadow-md hover:shadow-lg flex items-center gap-2 mx-auto"
                >
                    <span>🔄</span>
                    <span>รีเฟรชข้อมูล</span>
                </button>
                <p className="text-gray-500 text-sm mt-2">
                    อัปเดตอัตโนมัติทุก 30 วินาที
                </p>
            </div>
        </div>
    );
};

export default WarehouseDashboard;