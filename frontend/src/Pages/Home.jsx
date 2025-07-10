import React from 'react'
import DashboardCard from '../Component/DashboardCard.jsx';
import { FaTruck, FaClock, FaExclamationTriangle, FaCheck } from 'react-icons/fa';

const Home = () => {
  return (
    <div>
      <div className="dashboard-grid">
            <DashboardCard 
                title="รถทั้งหมด" 
                value="9 คัน" 
                icon={<FaTruck size={32} />} 
                bgColor="bg-blue-500" 
            />
            <DashboardCard 
                title="รถว่าง" 
                value="3 คัน" 
                icon={<FaCheck size={32} />} 
                bgColor="bg-green-500" 
            />
            <DashboardCard 
                title="รถลา" 
                value="2 คัน" 
                icon={<FaClock size={32} />} 
                bgColor="bg-yellow-400" 
            />
            <DashboardCard 
                title="รถมีปัญหา" 
                value="1 คัน" 
                icon={<FaExclamationTriangle size={32} />} 
                bgColor="bg-red-500" 
            />
        </div>
    </div>
  )
}

export default Home
