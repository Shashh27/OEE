import Analytics from "./Pages/Analytics";
import Home from "./Pages/Home";
import {MainPage} from "./Pages/MainPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Report from "./Pages/Report";
import Shiftwise from "./Pages/Shiftwise";

function App() {

  return (
    <>
 <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:machineId/home" element={<Home/>} />
        <Route path="/:machineId/shiftwise" element={<Shiftwise />} />
        <Route path="/:machineId/analytics" element={<Analytics />} />
        <Route path="/:machineId/report" element={<Report/>} />

      </Routes>
    </Router> 
  </>
  )
}

export default App