import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import '../Css/App.css'

import Home from '../Pages/Home';
import Navbar from '../Component/Navbar';

function App() {
  const [count, setCount] = useState(0)

  return (
     <Router>
      <Navbar />
      <Routes>
        
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  )
}

export default App
