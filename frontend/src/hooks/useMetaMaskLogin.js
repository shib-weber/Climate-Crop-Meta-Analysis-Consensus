import { useState } from "react";
import Web3 from "web3";

function useMetaMaskLogin() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const web3 = new Web3(window.ethereum);

        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        const walletAddress = accounts[0];
        setAccount(walletAddress);

        // 🔥 CALL BACKEND (instead of JSON)
        const response = await fetch("http://127.0.0.1:8000/register", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            wallet_address: walletAddress,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          setRole(data.role);

          // optional: store in localStorage
          localStorage.setItem("userRole", data.role);
          localStorage.setItem("userAccount", walletAddress);
        } else {
          console.error("Backend error:", data.detail);
          alert("Login failed: " + data.detail);
        }

      } catch (err) {
        console.error("Connection error:", err);
      }
    } else {
      alert("MetaMask not installed!");
    }
  };

  return { account, role, connectWallet };
}

export default useMetaMaskLogin;