import { FC } from "react";
import { FaFilter, FaSort } from "react-icons/fa"; // Using Font Awesome icons for filter and sort

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const FilterBar: FC<FilterBarProps> = ({ onSortChange, onFilterChange }) => (
  <div className="flex flex-col sm:flex-row justify-between items-center bg-gray-800 p-4 rounded mb-6">
    {/* Sort Dropdown with Icon */}
    <div className="flex items-center space-x-2 mb-4 sm:mb-0">
      <FaSort className="text-white" />
      <select
        onChange={(e) => onSortChange(e.target.value)}
        className="p-2 rounded bg-primary text-white focus:outline-none"
      >
        <option value="market_cap">Market Cap</option>
        <option value="price">Price</option>
        <option value="volume">Volume</option>
      </select>
    </div>

    {/* Filter Input with Icon */}
    <div className="flex items-center space-x-2">
      <FaFilter className="text-white" />
      <input
        type="text"
        placeholder="Filter by coin name"
        className="p-2 rounded bg-primary text-white focus:outline-none"
        onChange={(e) => onFilterChange(e.target.value)}
      />
    </div>
  </div>
);

export default FilterBar;
