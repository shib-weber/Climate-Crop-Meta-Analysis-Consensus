import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './Pages/LandingPage'
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard"
import ValidatorDashboard from "./Pages/ValidatorDashboard";
import PaperValidation from "./Pages/PaperValidation";


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/validator" element={<ValidatorDashboard />} />
        <Route path="/validate/:id" element={<PaperValidation />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
