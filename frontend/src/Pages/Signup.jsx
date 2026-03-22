import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate(); // for redirect

  // Connect MetaMask wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);

        navigate("/dashboard"); 
      } catch (error) {
        console.error("User rejected connection", error);
        alert("Connection rejected");
      }
    } else {
      const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

      if (isMobile) {
        // Open in MetaMask mobile browser
        window.location.href =
          "https://metamask.app.link/dapp/" +
          window.location.href.replace(/^https?:\/\//, "");
      } else {
        // Desktop install redirect
        window.open("https://metamask.io/download", "_blank");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-[350px] text-center">
        
        <h2 className="text-2xl font-bold mb-6">
          Sign Up with MetaMask 🚀
        </h2>

        {account ? (
          <div>
            <p className="mb-4 text-green-400 break-all">{account}</p>
            <button
              className="w-full bg-green-500 py-2 rounded-lg hover:bg-green-600"
              onClick={() => navigate("/dashboard")} // explicit proceed button redirect
            >
              Proceed
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="w-full flex items-center justify-center gap-2 bg-orange-500 py-2 rounded-lg hover:bg-orange-600 mb-4"
          >
            🦊 Connect MetaMask
          </button>
        )}

        <p className="text-sm text-gray-400 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-green-400 hover:underline">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;