import React, { useEffect, useState } from "react";
import useMetaMaskLogin from "../hooks/useMetaMaskLogin";
import Footer from "../components/Footer";

function Dashboard() {
  const { account, role, connectWallet } = useMetaMaskLogin();
  const [validatedData, setValidatedData] = useState([]);
  const [showData, setShowData] = useState(false);

  useEffect(() => {
    connectWallet();
  }, []);

  // Mock function to fetch validated data (replace with API/blockchain call)
  const fetchValidatedData = async () => {
    const dummyData = [
      { id: 1, title: "Cancer Research Study", status: "Approved" },
      { id: 2, title: "AI Drug Discovery", status: "Approved" },
    ];
    setValidatedData(dummyData);
    setShowData(true);
  };

  if (!account) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
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
    <div className="bg-gray-950 text-white min-h-screen flex flex-col">

      <div className="flex-grow p-8 max-w-6xl mx-auto w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-400 mt-2">Welcome back 👋</p>
        </div>

        {/* Account Info Card */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
          <p className="mb-2">
            <span className="text-gray-400">Account:</span> {account}
          </p>
          <p>
            <span className="text-gray-400">Role:</span>{" "}
            <span className="capitalize text-green-400">{role}</span>
          </p>
        </div>

        {/* Role Panel */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg mb-6">
          {role === "validator" ? (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                🛡️ Validator Panel
              </h2>
              <div className="flex gap-4">
                <button className="bg-blue-500 px-4 py-2 rounded-lg hover:bg-blue-600">
                  Approve Study
                </button>
                <button className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600">
                  Reject Study
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-semibold mb-2">
                🔬 Researcher Panel
              </h2>
              <p className="text-gray-400">
                You can view studies but cannot vote.
              </p>
            </div>
          )}
        </div>

        {/* Data Section */}
        <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            📊 Validated Studies / Data
          </h2>

          <button
            onClick={fetchValidatedData}
            className="bg-purple-500 px-4 py-2 rounded-lg hover:bg-purple-600 mb-4"
          >
            Load Validated Data
          </button>

          {showData && (
            <div className="space-y-3">
              {validatedData.length > 0 ? (
                validatedData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gray-800 p-4 rounded-lg flex justify-between"
                  >
                    <span>{item.title}</span>
                    <span className="text-green-400">
                      {item.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-gray-400">No validated data found.</p>
              )}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;