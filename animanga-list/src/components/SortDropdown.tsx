import React from 'react';

export interface SortDropdownProps {
  onSortChange: (sortType: string) => void;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange }) => {
  return (
    <div className="sort-dropdown">
      <select 
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="date-desc">Recently Completed</option>
        <option value="date-asc">Oldest Completed</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
};

export default SortDropdown; 