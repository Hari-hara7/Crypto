import { FC } from "react";

interface FilterBarProps {
  onSortChange: (value: string) => void;
  onFilterChange: (value: string) => void;
}

const FilterBar: FC<FilterBarProps> = ({ onSortChange, onFilterChange }) => (
  <div className="flex justify-between items-center bg-secondary p-4 rounded mb-6">
    <select
      onChange={(e) => onSortChange(e.target.value)}
      className="p-2 rounded bg-primary text-white"
    >
      <option value="market_cap">Market Cap</option>
      <option value="price">Price</option>
      <option value="volume">Volume</option>
    </select>
    <input
      type="text"
      placeholder="Filter by coin name"
      className="p-2 rounded bg-primary text-white"
      onChange={(e) => onFilterChange(e.target.value)}
    />
  </div>
);

export default FilterBar;
