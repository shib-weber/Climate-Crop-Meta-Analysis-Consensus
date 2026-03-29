import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './Pages/LandingPage'
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Dashboard from "./Pages/Dashboard"
import Upload from "./Pages/Upload";
import MyResearch from "./Pages/MyResearch";
import Explore from "./Pages/Explore";
import Verified from "./Pages/Verified";
import Vote from "./Pages/Vote";
import MyVotes from "./Pages/MyVotes";
import DocumentView from "./Pages/DocumentView";

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/upload" element={<Upload />} />
        <Route path="/my-research" element={<MyResearch />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/verified" element={<Verified />} />
        <Route path="/vote" element={<Vote />} />
        <Route path="/my-votes" element={<MyVotes />} />
        <Route path="/document/:id" element={<DocumentView />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
