import { useNavigate } from "react-router-dom";

function ValidatorDashboard() {
  const navigate = useNavigate();

  const demoPapers = [
    { id: 1, title: "Climate Yield Prediction using AI" },
    { id: 2, title: "Soil Carbon Impact Study" },
    { id: 3, title: "Rainfall vs Crop Productivity" },
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Pending Research Papers</h1>

      <div className="space-y-4">
        {demoPapers.map((paper) => (
          <div
            key={paper.id}
            onClick={() => navigate(`/validate/${paper.id}`)}
            className="p-4 bg-gray-900 border border-gray-800 rounded-xl cursor-pointer hover:bg-gray-800"
          >
            {paper.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ValidatorDashboard;