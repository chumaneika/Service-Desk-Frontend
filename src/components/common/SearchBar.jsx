const SearchBar = ({ value, onChange, placeholder = 'Поиск', className = '' }) => (
  <div className={`search-bar ${className}`}>
    <span className="search-bar__icon" aria-hidden="true" />
    <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
  </div>
);

export default SearchBar;

