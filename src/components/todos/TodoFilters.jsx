import { FILTERS } from "../../utils/constants";

const TodoFilters = ({ activeCount, currentFilter, onFilterChange, onClearCompleted }) => {
  return (
    <div className="bottom-items flex-row">
      <div className="items-left">
        <span>{activeCount}</span> items left
      </div>

      <div className="filter flex-row">
        {Object.values(FILTERS).map(filter => (
          <label key={filter}>
            <input
              type="radio"
              name="filter"
              id={filter}
              checked={currentFilter === filter}
              onChange={() => onFilterChange(filter)} 
            />
            <span>{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
          </label>
        ))}
      </div>

      <span className="clear" onClick={onClearCompleted}>
        Clear Completed
      </span>
    </div>
  );
};

export default TodoFilters;