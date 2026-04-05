import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Web3 from "web3";
import contractABI from "../../../abi/ClimateConsensus.json";

const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
function PaperValidation() {
  const { id } = useParams();

  const [paper, setPaper] = useState(null);

  useEffect(() => {
    loadPaper();
  }, [id]);

  const loadPaper = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const study = await contract.methods.getStudy(id).call();

    const cid = study[2];

    setPaper({
      title: study[1],
      fileUrl: `https://gateway.pinata.cloud/ipfs/${cid}`,
    });
  };

  const handleVote = async () => {
    const web3 = new Web3(window.ethereum);
    const contract = new web3.eth.Contract(contractABI, contractAddress);

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    await contract.methods.approveStudy(id).send({
      from: accounts[0],
    });

    alert("Vote submitted ✅");
  };

  if (!paper) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>

      {/* PDF from IPFS */}
      <div className="h-[500px] mb-6 border border-gray-800 rounded-xl overflow-hidden">
        <iframe
          src={paper.fileUrl}
          title="Research Paper"
          className="w-full h-full"
        />
      </div>

      {/* Voting */}
      <div className="flex gap-4">
        <button
          onClick={handleVote}
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          Approve ✅
        </button>
      </div>
    </div>
  );
}

export default PaperValidation;