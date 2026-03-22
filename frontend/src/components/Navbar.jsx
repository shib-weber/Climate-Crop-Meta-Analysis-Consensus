import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Handlers
  const handleLogin = () => {
    navigate("/login");
  };

  const handleSignup = () => {
    navigate("/signup");
  };

  return (
    <nav className="bg-gray-900 px-6 py-4 flex justify-between items-center">
      
      <h1 className="text-xl font-bold text-green-400">
        ClimateChain 🌱
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex gap-6 items-center">
        
        <button
          className="border border-white px-4 py-1 rounded-lg hover:bg-white hover:text-black"
          onClick={handleLogin}
        >
          Login
        </button>

        <button
          className="bg-green-500 px-4 py-1 rounded-lg hover:bg-green-600"
          onClick={handleSignup}
        >
          Sign Up
        </button>

        <a href="#" className="hover:text-green-400">
          Contact
        </a>
      </div>

      {/* Mobile Toggle */}
      <div className="md:hidden cursor-pointer" onClick={() => setOpen(!open)}>
        ☰
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="absolute top-16 right-4 bg-gray-800 p-4 rounded-xl flex flex-col gap-4 md:hidden">
          
          <button onClick={handleLogin} className="border px-3 py-1 rounded">
            Login
          </button>

          <button onClick={handleSignup} className="bg-green-500 px-3 py-1 rounded">
            Sign Up
          </button>

          <a href="#">Contact</a>
        </div>
      )}
    </nav>
  );
}

export default Navbar;