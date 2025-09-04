import { useContext } from "react";
import { BookContext } from "../context/BookContext";
import SearchBar from "../components/SearchBar";
import BookCard from "../components/BookCard";
import Loader from "../components/Loader";

const Home = () => {
  const { books, loading } = useContext(BookContext);

  return (
    <div className="container mx-auto px-4">
      <SearchBar />
      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.length > 0 ? (
            books.map((book, index) => <BookCard key={index} book={book} />)
          ) : (
            <p className="col-span-full text-center text-gray-500 mt-10">No books found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;