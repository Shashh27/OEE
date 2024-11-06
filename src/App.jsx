import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import {MainPage} from "./Pages/MainPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
 <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:machineId/home" element={<Home/>} />
      </Routes>
    </Router> 
  </>
  )
}

export default App
