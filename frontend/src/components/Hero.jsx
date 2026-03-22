import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate("/login");
  };
  return (
    <section className="flex flex-col md:flex-row items-center justify-between px-8 py-16">
      
      <div className="max-w-xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Decentralized Climate Research 🌍
        </h1>

        <p className="text-gray-400 mb-6">
          Submit, validate, and analyze climate studies using blockchain-based consensus.
        </p>
        <p className="text-gray-400 mb-6">Researchers can securely submit crop-climate studies to a decentralized network, where designated validators review and verify the data for accuracy and authenticity. Through a consensus mechanism, only trusted and approved studies are recorded on the blockchain, ensuring immutability and transparency. </p>

        <button className="bg-green-500 px-6 py-2 rounded-lg hover:bg-green-600" onClick={handleClick}>
          Get Started
        </button>
      </div>

      <div className="mt-10 md:mt-0">
        <img
          src="https://images.unsplash.com/photo-1508780709619-79562169bc64"
          alt="climate"
          className="rounded-2xl shadow-lg w-[400px]"
        />
      </div>

    </section>
  );
}

export default Hero;