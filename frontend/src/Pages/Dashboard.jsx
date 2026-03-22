import React, { useEffect } from "react";
import useMetaMaskLogin from "../hooks/useMetaMaskLogin";

function Dashboard() {
  const { account, role, connectWallet } = useMetaMaskLogin();

  useEffect(() => {
    connectWallet(); // auto-connect on page load
  }, []);

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <button
          className="bg-green-500 px-6 py-3 rounded-lg text-white hover:bg-green-600"
          onClick={connectWallet}
        >
          Connect MetaMask
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <p className="mb-4">Logged in as: {account}</p>
      <p className="mb-6">Role: {role}</p>

      {/* Conditional rendering based on role */}
      {role === "validator" ? (
        <div>
          <h2 className="text-xl font-semibold mb-2">Validator Panel</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mr-2">
            Approve Study
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Reject Study
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-semibold mb-2">Researcher Panel</h2>
          <p>You can view the studies but cannot vote.</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;