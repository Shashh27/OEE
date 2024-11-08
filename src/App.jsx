import Analytics from "./Pages/Analytics";
import Dashboard from "./Pages/Dashboard";
import Home from "./Pages/Home";
import {MainPage} from "./Pages/MainPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Weekly from "./Pages/Weekly";
import Monthly from "./Pages/Monthly";
import Report from "./Pages/Report";

function App() {

  return (
    <>
 <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:machineId/home" element={<Home/>} />
        <Route path="/:machineId/analytics" element={<Analytics/>} />
        <Route path="/:machineId/weekly" element={<Weekly/>} />
        <Route path="/:machineId/monthly" element={<Monthly/>} />
        <Route path="/:machineId/report" element={<Report/>} />

      </Routes>
    </Router> 
  </>
  )
}

export default App
