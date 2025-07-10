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
      </div>
      
    </div>
  )
}

export default Home
