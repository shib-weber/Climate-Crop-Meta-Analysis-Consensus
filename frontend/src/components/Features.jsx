function Features() {
  return (
    <section className="px-8 py-16 text-center">
      
      <h2 className="text-3xl font-bold mb-10">Key Features</h2>

      <div className="grid md:grid-cols-3 gap-6">
        
        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🔗 Blockchain Security</h3>
          <p className="text-gray-400">Tamper-Proof Records
Once climate or crop data is stored on the blockchain, it cannot be altered or deleted, ensuring long-term data integrity.
End-to-End Transparency </p>
<p className="text-gray-400">All stakeholders (researchers, policymakers, farmers) can view the same verified dataset, eliminating hidden manipulations.
Decentralized Trust Model</p>
<p className="text-gray-400">No single authority controls the data—validation is distributed across multiple nodes, reducing bias and corruption.
Auditability & Traceability</p>
<p className="text-gray-400">Every data entry includes timestamps and transaction history, making it easy to trace the origin and modifications (if any).</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">🧑‍🔬 Validator System</h3>
          <p className="text-gray-400">Role-Based Validation,
Validators are responsible for reviewing and verifying submitted crop-climate studies before they are accepted into the system.</p>
        
        <p className="text-gray-400">Consensus Mechanism
Data is approved only when a predefined majority (e.g., 70% agreement) of validators approve it, ensuring reliability.</p>
        <p className="text-gray-400">Incentive Mechanism
Validators may receive rewards (tokens or recognition) for honest validation and penalties for malicious or careless behavior.</p>
        <p className="text-gray-400">Fraud Detection & Rejection
Suspicious, duplicate, or low-quality data submissions can be flagged and rejected collectively.
Time-Bound Validation</p>
</div>

        <div className="bg-gray-800 p-6 rounded-2xl shadow-lg hover:scale-105 transition">
          <h3 className="text-xl font-semibold mb-2">📈 Meta Analysis</h3>
          <p className="text-gray-400">Aggregated Research Insights
Combines results from multiple independent crop-climate studies to produce more robust and generalized conclusions.</p>
<p className="text-gray-400">Improved Decision-Making
Helps policymakers and agricultural experts make data-driven decisions based on a broader evidence base rather than a single study.</p>
<p className="text-gray-400">Consensus-Based Results
Works hand-in-hand with the validator system to ensure only verified and high-quality studies contribute to the analysis.</p>
<p className="text-gray-400">Trend Identification
Detects long-term patterns such as climate impact on crop yield, soil health, and seasonal variations.</p>
        </div>

      </div>

    </section>
  );
}

export default Features;