import { useState } from "react";
import { useNavigate } from "react-router-dom"; // import navigate

function Login() {
  const [account, setAccount] = useState(null);
  const navigate = useNavigate(); // initialize navigate

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        setAccount(accounts[0]);
        // Redirect to dashboard after login
        navigate("/dashboard"); // <-- add this
      } else {
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          window.location.href =
            "https://metamask.app.link/dapp/" +
            window.location.href.replace(/^https?:\/\//, "");
        } else {
          window.open("https://metamask.io/download", "_blank");
        }
      }
    } catch (error) {
      console.error(error);
      alert("Connection failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg w-[350px] text-center">
        <h2 className="text-2xl font-bold mb-6">Login with Wallet 🔐</h2>

        {/* Wallet Button */}
        <button
          onClick={connectWallet}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 py-2 rounded-lg hover:bg-orange-600 mb-4"
        >
          🦊 Connect MetaMask
        </button>

        {/* Show connected wallet */}
        {account && (
          <p className="text-green-400 text-sm break-all">
            Connected: {account}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-2 my-4">
          <hr className="flex-1 border-gray-700" />
          <span className="text-gray-400 text-sm">OR</span>
          <hr className="flex-1 border-gray-700" />
        </div>

        <p className="text-gray-400 text-sm">
          Use MetaMask to securely login and interact with blockchain.
        </p>
      </div>
    </div>
  );
}

export default Login;