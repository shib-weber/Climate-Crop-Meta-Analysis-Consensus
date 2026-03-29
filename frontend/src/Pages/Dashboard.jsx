import React, { useEffect, useState } from "react";
import useMetaMaskLogin from "../hooks/useMetaMaskLogin";
import Footer from "../components/Footer";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

function Dashboard() {
  const { account, role, connectWallet } = useMetaMaskLogin();

  const [stats, setStats] = useState({
    correlation: 0,
    trend: [],
    loading: true
  });

  useEffect(() => {
    if (!account) connectWallet();
    fetchAnalysis();
  }, [account]);

  // Fetch BigQuery data from backend
  const fetchAnalysis = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/meta-analysis");
      const data = await response.json();

      setStats({
        correlation: data.correlation,
        trend: data.trend || [],
        loading: false
      });
    } catch (err) {
      console.error("BigQuery fetch failed", err);
      setStats({
        correlation: 0,
        trend: [],
        loading: false
      });
    }
  };

  // If wallet not connected
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

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold">Research Node</h1>
            <p className="text-gray-400">
              Identity: <span className="font-mono text-xs">{account}</span>
            </p>
          </div>
          <div className="bg-gray-900 border border-gray-800 px-4 py-2 rounded-full">
            <span className="text-gray-500 text-sm mr-2">Role:</span>
            <span className="capitalize text-green-400 font-bold">{role}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">

            {role === "validator" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-blue-900/30 shadow-xl">
                <h2 className="text-xl font-bold mb-4">🛡️ Validator Actions</h2>
                <div className="flex flex-col gap-3">
                  <button className="bg-blue-600 py-3 rounded-xl hover:bg-blue-500">
                    Verify Pending Papers
                  </button>
                  <button className="bg-gray-800 py-3 rounded-xl hover:bg-gray-700">
                    View Audit Logs
                  </button>
                </div>
              </section>
            )}

            {role === "researcher" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-purple-900/30 shadow-xl">
                <h2 className="text-xl font-bold mb-4">🔬 Researcher Tools</h2>
                <button className="w-full bg-purple-600 py-3 rounded-xl hover:bg-purple-500">
                  Upload New Dataset (IPFS)
                </button>
              </section>
            )}
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-2 space-y-6">

            {/* Analytics Panel */}
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">📊 Crop-Climate Meta-Analysis</h2>
                <div className="text-right">
                  <p className="text-xs text-gray-500 uppercase font-bold">
                    Current Correlation
                  </p>
                  <p className={`text-2xl font-mono ${stats.correlation < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stats.loading ? "..." : stats.correlation.toFixed(4)}
                  </p>
                </div>
              </div>

              {/* Chart */}
              <div className="h-64 bg-gray-950 rounded-xl border border-gray-800 p-2">
                {stats.loading ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Loading chart...
                  </div>
                ) : stats.trend.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    No trend data available
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="temp"
                        stroke="#22c55e"
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line
                        type="monotone"
                        dataKey="yield"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </section>

            {/* Approved Papers */}
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
              <h2 className="text-xl font-bold mb-4">📄 Approved Research Papers</h2>
              <div className="space-y-3">
                <div className="p-4 bg-gray-950 rounded-xl flex justify-between items-center border border-gray-800 hover:border-green-500/50 transition">
                  <span>Holistic Yield Analysis 2025.pdf</span>
                  <span className="text-xs bg-green-900/30 text-green-400 px-3 py-1 rounded-full uppercase">
                    On-Chain Verified
                  </span>
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