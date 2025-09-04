import { useContext } from "react";
import { BookContext } from "../context/BookContext";

const SearchBar = () => {
  const { query, setQuery, searchBooks } = useContext(BookContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) searchBooks(query);
  };

  return (
    <form onSubmit={handleSubmit} className="flex justify-center my-6">
      <input
        type="text"
        className="border border-gray-300 rounded-l px-4 py-2 w-full max-w-md"
        placeholder="Search books by title..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-r">
        Search
      </button>
    </form>
  );
};

export default SearchBar;