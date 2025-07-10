import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../Css/App.css'

import Home from '../Pages/Home';
import Navbar from '../Component/Navbar';
import Map from './Map';

function App() {
  const [count, setCount] = useState(0)

  return (
     <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/map" element={<Map />} />
      </Routes>
    </Router>
  )
}

export default App
