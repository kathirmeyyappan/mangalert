import React from 'react';

export interface SortDropdownProps {
  onSortChange: (sortType: string) => void;
  section: string;
}

const SortDropdown: React.FC<SortDropdownProps> = ({ onSortChange, section }) => {
  return (
    <div className="sort-dropdown">
      <label className="sort-label">Sort {section}:</label>
      <select 
        onChange={(e) => onSortChange(e.target.value)}
        className="sort-select"
      >
        <option value="date-desc">By Recently Completed</option>
        <option value="date-asc">By Oldest Completed</option>
        <option value="alphabetical">Alphabetical</option>
      </select>
    </div>
  );
};

export default SortDropdown; 