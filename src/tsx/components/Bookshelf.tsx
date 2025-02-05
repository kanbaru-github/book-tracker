import { useEffect, useState } from "react";
import { GoogleBook } from "../../ts/types/google_book";
import { HAVE_READ_SHELF_ID } from "../../ts/constants/google_book";
import "../../scss/components/Bookshelf.scss";
import BookList from "./BookList";

const USER_ID = import.meta.env.VITE_GOOGLE_BOOKS_USER_ID;
const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;

/**
 * 書籍一覧
 * @returns {JSX.Element}
 */
const Bookshelf = () => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/users/${USER_ID}/bookshelves/${HAVE_READ_SHELF_ID}/volumes?key=${API_KEY}`
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
    <section className="bookshelf">
      <h2>書棚</h2>

      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          読み込み中...
        </div>
      ) : error ? (
        <div className="error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <BookList books={books} />
      )}
    </section>
  );
};

export default Bookshelf;
