export const SearchBar = ({ onSearch }) => {
  return (
    <div className="search-container">
      <input 
        type="text" 
        placeholder="Buscar personaje..." 
        onChange={(e) => onSearch(e.target.value)}
        className="simpson-input"
      />
    </div>
  );
};