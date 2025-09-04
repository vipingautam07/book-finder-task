const BookCard = ({ book }) => {
  const { title, author_name, first_publish_year, cover_i } = book;
  const imageUrl = cover_i
    ? `https://covers.openlibrary.org/b/id/${cover_i}-M.jpg`
    : "https://via.placeholder.com/150";

  return (
    <div className="bg-white shadow-md rounded p-4 max-w-xs">
      <img src={imageUrl} alt={title} className="w-full h-64 object-cover rounded" />
      <h3 className="mt-2 font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600">{author_name?.join(", ")}</p>
      <p className="text-xs text-gray-500">Published: {first_publish_year}</p>
    </div>
  );
};

export default BookCard;