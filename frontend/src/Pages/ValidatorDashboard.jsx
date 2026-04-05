import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Web3 from "web3";
import contractABI from "../../../abi/ClimateConsensus.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;

function ValidatorDashboard() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (!window.ethereum) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]); // ✅ store once
  };

  // 🔥 Fetch AFTER account is set
  useEffect(() => {
    if (account) {
      loadPapers();
    }
  }, [account]);

  const loadPapers = async () => {
    try {
      const web3 = new Web3(window.ethereum);

      const contract = new web3.eth.Contract(
        contractABI,
        contractAddress
      );

      const ids = await contract.methods
        .getPendingStudies(account) // ✅ NOW USING STATE
        .call();

      console.log("Validator:", account);
      console.log("Pending IDs:", ids);

      const result = [];

      for (let id of ids) {
        const study = await contract.methods.getStudy(id).call();

        result.push({
          id,
          title: study[1],
          cid: study[2],
        });
      }

      setPapers(result);
    } catch (err) {
      console.error(err);
      alert("Failed to load papers");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">
        Pending Research Papers
      </h1>

      <p className="text-sm text-gray-400 mb-4">
        Wallet: {account}
      </p>

      {loading ? (
        <p>Loading...</p>
      ) : papers.length === 0 ? (
        <p>No pending papers 🎉</p>
      ) : (
        <div className="space-y-4">
          {papers.map((paper) => (
            <div
              key={paper.id}
              onClick={() => navigate(`/validate/${paper.id}`)}
              className="p-4 bg-gray-900 border border-gray-800 rounded-xl cursor-pointer hover:bg-gray-800"
            >
              <h2 className="font-semibold">{paper.title}</h2>
              <p className="text-sm text-gray-400 truncate">
                {paper.cid}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ValidatorDashboard;