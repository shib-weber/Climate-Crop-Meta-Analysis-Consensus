import { useEffect, useState, useRef } from "react";
import useMetaMaskLogin from "../hooks/useMetaMaskLogin";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import contractABI from "../../../abi/ClimateConsensus.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function Dashboard() {
  const navigate=useNavigate();
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const { account, role, connectWallet } = useMetaMaskLogin();

  const [stats, setStats] = useState({
    correlation: 0,
    trend: [],
    loading: true,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!account) connectWallet();
    fetchAnalysis();
  }, [account]);

  // 📊 Fetch analytics
  const fetchAnalysis = async () => {
    
    try {
      const response = await fetch("http://127.0.0.1:8000/meta-analysis");
      const data = await response.json();

      setStats({
        correlation: data.correlation,
        trend: data.trend || [],
        loading: false,
      });
    } catch (err) {
      console.error("BigQuery fetch failed", err);
      setStats({
        correlation: 0,
        trend: [],
        loading: false,
      });
    }
  };

  // 🚀 Upload function
const handleUpload = async () => {
  if (!file) return alert("Select file");

  const formData = new FormData();
  formData.append("file", file);
  const studyID = "study_" + Date.now();
  const doi = "10.1000/test";

  formData.append("studyID", studyID);
  formData.append("doi", doi);

  try {
    setLoading(true);

    // 🔹 STEP 1: Upload to backend (Pinata)
    const res = await fetch("http://127.0.0.1:8000/submit_study", {
      method: "POST",
      body: formData,
    });

    
    const data = await res.json();
    

    if (data.status !== "success") {
      throw new Error(data.message);
    }

    const cid = data.cid;
    console.log("CID from backend:", cid);

    // 🔹 STEP 2: Send to blockchain via MetaMask
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);
try{
await contract.methods
  .submitStudy(studyID, doi, cid)
  .send({ 
    from: account,
    gas: 3000000  
  });
  } catch (err) {
  console.log("Revert reason:", err?.data?.message); // This will show the exact require() that failed
}

    alert("✅ Uploaded & Submitted to Blockchain!");

    setFile(null);

  } catch (err) {
    console.error(err);
    alert("Upload failed");
  }

  setLoading(false);
};
  // 🎯 Smart button behavior
  const handleButtonClick = () => {
    if (!file) {
      fileInputRef.current.click();
    } else {
      handleUpload();
    }
  };

  // 🔐 Wallet not connected
  if (!account) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white">
        <h2 className="text-2xl mb-4 font-bold">Climate Research Portal</h2>
        <button
          className="bg-green-600 px-8 py-3 rounded-full font-bold shadow-lg hover:bg-green-500"
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

          {/* LEFT PANEL */}
          <div className="space-y-6">

            {role === "validator" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-blue-900/30">
                <h2 className="text-xl font-bold mb-4">🛡️ Validator Actions</h2>
                <button className="bg-blue-600 py-3 w-full rounded-xl mb-2" onClick={()=>navigate('/validator')}>
                  Verify Pending Papers
                </button>
                <button className="bg-gray-800 py-3 w-full rounded-xl">
                  View Audit Logs
                </button>
              </section>
            )}

            {role === "researcher" && (
              <section className="bg-gray-900 p-6 rounded-2xl border border-purple-900/30">
                <h2 className="text-xl font-bold mb-4">🔬 Researcher Tools</h2>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />

                <button
                  className="w-full bg-purple-600 py-3 rounded-xl"
                  onClick={handleButtonClick}
                >
                  {loading
                    ? "Uploading..."
                    : file
                    ? "Submit to Blockchain 🔗"
                    : "Choose File 📁"}
                </button>

                {file && (
                  <p className="mt-3 text-sm text-gray-400">
                    Selected: {file.name}
                  </p>
                )}
              </section>
            )}
          </div>

          {/* RIGHT PANEL */}
          <div className="lg:col-span-2 space-y-6">

            {/* Papers */}
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">📄 Approved Research Papers</h2>
              <div className="p-4 bg-gray-950 rounded-xl border border-gray-800">
                Holistic Yield Analysis 2025.pdf
              </div>
            </section>

            {/* Analytics */}
            <section className="bg-gray-900 p-6 rounded-2xl border border-gray-800">
              <h2 className="text-xl font-bold mb-4">📊 Meta Analysis</h2>

              <div className="h-64">
                {stats.loading ? (
                  <p>Loading...</p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stats.trend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="temp" stroke="#22c55e" />
                      <Line type="monotone" dataKey="yield" stroke="#3b82f6" />
                    </LineChart>
                  </ResponsiveContainer>
                )}
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