import { Link } from "react-router-dom";  // Import Link

const Header: React.FC = () => (
  <header className="bg-primary text-white py-4 px-6 flex justify-between items-center">
    <h1 className="text-2xl font-bold">Crypto Tracker</h1>
    <nav>
      <Link to="/" className="mx-4 hover:underline">Home</Link>
      <Link to="/coins" className="mx-4 hover:underline">Coins</Link>
      <Link to="/converter" className="mx-4 hover:underline">Converter</Link>
      <Link to="/news" className="mx-4 hover:underline">News</Link>
      <Link to="/compare" className="mx-4 hover:underline">Compare Coins</Link> {/* Link to CoinComparison */}
    </nav>
  </header>
);

export default Header;
