import React, { useState, useEffect } from 'react';

// Inline SVG for icons to avoid external dependencies and simplify the codebase
const SearchIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-search"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const LoaderIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-loader"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>
);
const UserIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-user"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
);
const BookTextIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-book-text"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V6.5A2.5 2.5 0 0 0 17.5 4H4a2 2 0 0 0-2 2v13.5A2.5 2.5 0 0 0 4 19.5zM12 9h6M12 13h6M12 17h6M2 13h2M2 17h2"></path></svg>
);


// Main App component
const App = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('title');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch books from the Open Library API
  const fetchBooks = async (searchQuery) => {
    if (!searchQuery) return;
    setLoading(true);
    setError(null);
    setBooks([]);

    let url = '';
    if (searchType === 'title') {
      url = `https://openlibrary.org/search.json?title=${encodeURIComponent(searchQuery)}`;
    } else if (searchType === 'author') {
      url = `https://openlibrary.org/search.json?author=${encodeURIComponent(searchQuery)}`;
    } else if (searchType === 'subject') {
      url = `https://openlibrary.org/subjects/${encodeURIComponent(searchQuery.toLowerCase())}.json`;
    }

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      let fetchedBooks = [];
      if (searchType === 'subject') {
        fetchedBooks = data.works || [];
      } else {
        fetchedBooks = data.docs || [];
      }

      setBooks(fetchedBooks);
    } catch (e) {
      setError('Failed to fetch books. Please check your network connection and try again.');
      console.error('Fetching error:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchBooks(query);
  };

  const renderBookCard = (book) => {
    const title = book.title || (book.title_suggest || 'No Title Available');
    const authors = book.author_name ? book.author_name.join(', ') : 'Unknown Author';
    const firstPublishYear = book.first_publish_year || 'N/A';
    
    // Determine cover ID based on search type
    let coverId = null;
    if (searchType === 'title' || searchType === 'author') {
        coverId = book.cover_i;
    } else if (searchType === 'subject' && book.cover_id) {
        coverId = book.cover_id;
    }

    const coverUrl = coverId 
      ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg` 
      : 'https://placehold.co/128x193/e2e8f0/71717a?text=No+Cover';

    return (
      <div key={book.key || Math.random()} className="bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1">
        <img 
          src={coverUrl} 
          alt={`Cover for ${title}`} 
          className="w-full h-auto rounded-lg mb-4 object-contain mx-auto"
        />
        <h3 className="font-bold text-lg mb-1 text-gray-900">{title}</h3>
        <p className="text-sm text-gray-700 mb-1 flex items-center"><UserIcon size={16} className="mr-1" />{authors}</p>
        <p className="text-sm text-gray-500 flex items-center"><BookTextIcon size={16} className="mr-1" />First Published: {firstPublishYear}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-4 sm:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white p-6 sm:p-10 rounded-3xl shadow-2xl mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-center text-slate-900 mb-2">Book Finder</h1>
        <p className="text-center text-slate-500 mb-8 max-w-prose mx-auto">Discover your next great read by searching titles, authors, or subjects from the Open Library.</p>
        
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-4 mb-6">
          <div className="flex-grow">
            <label htmlFor="query" className="sr-only">Search Query</label>
            <input
              id="query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or subject..."
              className="w-full p-3 pl-5 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 transition-colors duration-200 shadow-sm"
            />
          </div>
          
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-4 items-center justify-center">
            <label className="flex items-center cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name="searchType"
                value="title"
                checked={searchType === 'title'}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2">Title</span>
            </label>
            <label className="flex items-center cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name="searchType"
                value="author"
                checked={searchType === 'author'}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2">Author</span>
            </label>
            <label className="flex items-center cursor-pointer text-sm text-gray-700">
              <input
                type="radio"
                name="searchType"
                value="subject"
                checked={searchType === 'subject'}
                onChange={(e) => setSearchType(e.target.value)}
                className="form-radio text-blue-600 h-4 w-4"
              />
              <span className="ml-2">Subject</span>
            </label>
          </div>
          
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center shadow-lg"
          >
            <SearchIcon size={20} className="mr-2" /> Search
          </button>
        </form>
      </div>

      <div className="w-full max-w-5xl">
        {loading && (
          <div className="flex justify-center items-center py-10">
            <LoaderIcon size={48} className="animate-spin text-blue-500" />
            <span className="ml-4 text-xl text-gray-600">Loading books...</span>
          </div>
        )}
        
        {error && (
          <div className="text-center text-red-500 p-4 rounded-lg bg-red-100 border-l-4 border-red-500 my-4">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && books.length === 0 && query && (
          <div className="text-center text-gray-500 py-10">
            <p className="text-2xl font-semibold">No books found.</p>
            <p className="text-lg">Please try a different search query or type.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map(renderBookCard)}
        </div>
      </div>
    </div>
  );
};

export default App;
