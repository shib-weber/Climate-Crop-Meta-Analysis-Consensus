import { useParams } from "react-router-dom";
import {useState ,useEffect} from "react"

function PaperValidation() {
  const { id } = useParams();

  const [paper, setPaper] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    // Demo fetch
    const demoPaper = {
      title: "Climate Yield Prediction using AI",
      fileUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
    };

    const demoAnalysis = {
      correlation: 0.82,
      summary: "Strong positive correlation between temperature and yield.",
    };

    setPaper(demoPaper);
    setAnalysis(demoAnalysis);
  }, [id]);

  const handleVote = (vote) => {
    alert(`You voted: ${vote}`);
  };

  if (!paper) return <p className="text-white">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-2xl font-bold mb-4">{paper.title}</h1>

      {/* PDF Viewer */}
      <div className="h-[500px] mb-6 border border-gray-800 rounded-xl overflow-hidden">
        <iframe
          src={paper.fileUrl}
          title="Research Paper"
          className="w-full h-full"
        />
      </div>

      {/* Meta Analysis */}
      <div className="bg-gray-900 p-4 rounded-xl mb-6">
        <h2 className="text-xl font-bold mb-2">Meta Analysis</h2>
        <p>Correlation: {analysis?.correlation}</p>
        <p>{analysis?.summary}</p>
      </div>

      {/* Voting */}
      <div className="flex gap-4">
        <button
          onClick={() => handleVote("ACCEPT")}
          className="bg-green-600 px-6 py-3 rounded-xl"
        >
          Accept ✅
        </button>

        <button
          onClick={() => handleVote("REJECT")}
          className="bg-red-600 px-6 py-3 rounded-xl"
        >
          Reject ❌
        </button>
      </div>
    </div>
  );
}

export default PaperValidation;
