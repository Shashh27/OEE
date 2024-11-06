import Dashboard from "./Pages/Dashboard";
import MainPage from "./Pages/MainPage"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <>
 <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/:machineName/dashboard" element={<Dashboard />} />

      </Routes>
    </Router>    </>
  )
}

export default App
