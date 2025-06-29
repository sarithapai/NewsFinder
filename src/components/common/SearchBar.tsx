type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearchEnter: () => void;
};

const SearchBar = ({ value, onChange, onSearchEnter }: SearchBarProps) => {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSearchEnter();
      }}
    >
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search articles..."
        className="md:w-100 w-80 px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
};

export default SearchBar;
