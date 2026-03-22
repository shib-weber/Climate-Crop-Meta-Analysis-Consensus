import { useState, useEffect } from "react";
import Web3 from "web3";
import accountsData from "../data/accounts.json"; 

function useMetaMaskLogin() {
  const [account, setAccount] = useState(null);
  const [role, setRole] = useState(null);

  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setAccount(accounts[0]);

        // Get role from JSON
        const user = accountsData.find(a => a.address.toLowerCase() === accounts[0].toLowerCase());
        if (user) setRole(user.role);
        else setRole("researcher"); // default role
      } catch (err) {
        console.error("User rejected connection", err);
      }
    } else {
      alert("MetaMask not installed! Please install it to continue.");
    }
  };

  return { account, role, connectWallet };
}

export default useMetaMaskLogin;