import React, { useEffect, useState } from "react";
import useMetaMaskLogin from "../hooks/useMetaMaskLogin";
import Footer from "../components/Footer";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Dashboard() {
  const { account, role, connectWallet } = useMetaMaskLogin();
  const [stats, setStats] = useState({ correlation: 0, loading: true });

  useEffect(() => {
    if (!account) connectWallet();
    fetchAnalysis(); // Fetch BigQuery data on load
  }, [account]);

  // Fetching the BigQuery Results from your Python Backend
  const fetchAnalysis = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/meta-analysis");
      const data = await response.json();
      setStats({ correlation: data.correlation, loading: false });
    } catch (err) {
      console.error("BigQuery fetch failed", err);
      setStats({ correlation: 0, loading: false });
    }
  };

  if (!account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <h2 className="text-2xl mb-4 font-bold">Climate Research Portal</h2>
        <button
          className="bg-green-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-500 transition-all"
          onClick={connectWallet}
        >
          Connect MetaMask to Enter
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-950 text-white min-h-screen flex flex-col font-sans">
      <div className="flex-grow p-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Research Node</h1>
            <p className="text-gray-400">Identity: <span className="font-mono text-xs">{account}</span></p>
          </div>
          <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-full">
            <span className="text-gray-500 text-sm mr-2">Role:</span>
            <span className="capitalize text-green-400 font-bold">{role}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Role-Specific Actions */}
          <div className="lg:col-span-1 space-y-6">
            {role === "validator" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-blue-900/30 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🛡️</span> Validator Actions
                </h2>
                <div className="flex flex-col gap-3">
                  <button className="bg-blue-600 py-3 rounded-xl hover:bg-blue-500 transition">Verify Pending Papers</button>
                  <button className="bg-gray-800 py-3 rounded-xl hover:bg-gray-700 transition">View Audit Logs</button>
                </div>
              </section>
            )}

            {role === "researcher" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-purple-900/30 shadow-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <span>🔬</span> Researcher Tools
                </h2>
                <button className="w-full bg-purple-600 py-3 rounded-xl hover:bg-purple-500 transition">
                  Upload New Dataset (IPFS)
                </button>
              </section>
            )}
          </div>

          {/* Right Column: The BigQuery Analytics Panel (Visible to All) */}
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">📊 Crop-Climate Meta-Analysis</h2>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">Current Correlation</p>
                  <p className={`text-2xl font-mono ${stats.correlation < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.loading ? "..." : stats.correlation.toFixed(4)}
                  </p>
                </div>
              </div>
              
              {/* Visual Chart Placeholder */}
              <div className="h-64 bg-gray-950 rounded-xl flex items-center justify-center border border-gray-800">
                <p className="text-gray-600 text-sm">[ BigQuery Data Visualization via Recharts ]</p>
              </div>
            </section>

            {/* Document List */}
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
               <h2 className="text-xl font-bold mb-4">📄 Approved Research Papers</h2>
               <div className="space-y-3">
                 {/* Map through your real validatedData here */}
                 <div className="p-4 bg-gray-950 rounded-xl flex justify-between items-center border border-gray-800 hover:border-green-500/50 transition">
                   <span>Holistic Yield Analysis 2025.pdf</span>
                   <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full uppercase">On-Chain Verified</span>
                 </div>
               </div>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Dashboard;