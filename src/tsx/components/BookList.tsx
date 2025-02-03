import { useEffect, useState } from "react";
import { GoogleBook } from "../../types/google_book";
import { HAVE_READ_SHELF_ID } from "../../constants/google_book";

const USER_ID = import.meta.env.VITE_GOOGLE_BOOKS_USER_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

/**
 * 書籍一覧
 * @returns {JSX.Element}
 */
const BookList = () => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/users/${USER_ID}/bookshelves/${HAVE_READ_SHELF_ID}/volumes?key=${API_KEY}`,
        );
        const data = await response.json();
        const fetchedBooks = data.items || [];
        setBooks(fetchedBooks);
      } catch (err) {
        setError("書籍データの取得に失敗しました");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <section>
      <h1 className="text-3xl font-bold mb-6">書籍管理</h1>

      {loading ? (
        <div className="text-center py-8">読み込み中...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-600">{error}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {books.map(book => (
            <div
              key={book.id}
              className="border rounded-lg p-4 hover:shadow-lg transition"
            >
              <div className="flex gap-4">
                {book.volumeInfo.imageLinks?.thumbnail && (
                  <img
                    src={book.volumeInfo.imageLinks.thumbnail}
                    alt={book.volumeInfo.title}
                    className="w-32 h-48 object-cover"
                  />
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">
                    {book.volumeInfo.title}
                  </h3>
                  <p className="text-gray-600">
                    {book.volumeInfo.authors?.join(", ")}
                  </p>
                  {book.volumeInfo.categories && (
                    <p className="text-sm text-blue-600 mt-1">
                      {book.volumeInfo.categories.join(", ")}
                    </p>
                  )}
                  {book.volumeInfo.description && (
                    <p className="text-sm text-gray-500 mt-2 line-clamp-3">
                      {book.volumeInfo.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default BookList;