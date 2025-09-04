import { createContext, useState } from "react";

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchBooks = async (searchTerm) => {
    setLoading(true);
    try {
      const res = await fetch(`https://openlibrary.org/search.json?title=${searchTerm}`);
      const data = await res.json();
      setBooks(data.docs);
    } catch (err) {
      console.error("Error fetching books:", err);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <BookContext.Provider value={{ query, setQuery, books, searchBooks, loading }}>
      {children}
    </BookContext.Provider>
  );
};