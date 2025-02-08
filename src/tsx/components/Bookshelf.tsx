import { useEffect, useState } from "react";
import { GoogleBook } from "../../ts/types/google_book";
import { HAVE_READ_SHELF_ID } from "../../ts/constants/google_book";
import "../../scss/components/Bookshelf.scss";
import BookList from "./BookList";

const Bookshelf: React.FC = () => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 1. ユーザーIDをローカルストレージから取得 無ければdialogを表示して登録を促す
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  // 2. ユーザーIDが取得できたら、Google Books APIを利用して読み込み中を表示
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${HAVE_READ_SHELF_ID}/volumes`
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

    if (userId) {
      fetchBooks();
    }
  }, [userId]);

  const handleSetUserId = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newUserId = formData.get("userId") as string;

    if (newUserId) {
      localStorage.setItem("userId", newUserId);
      setUserId(newUserId);
      setIsDialogOpen(false);
    }
  };

  const removeUserId = () => {
    localStorage.removeItem("userId");
    setUserId(null);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (isDialogOpen) {
      const dialog = document.querySelector(".bookshelf__dialog") as HTMLDialogElement;
      dialog.querySelector("input")?.focus();
      document.body.style.overflow = "hidden";
    }
  }, [isDialogOpen]);

  return (
    <section className="bookshelf">
      <h2>書棚</h2>

      {isDialogOpen || (
        <button
          onClick={removeUserId}
          className="bookshelf__deleteBtn"
          area-label="Google BooksユーザーID削除"
        >
          ユーザーIDを削除
        </button>
      )}

      <dialog open={isDialogOpen} className="bookshelf__dialog">
        <p>
          Google BooksのユーザーIDを入力してください。
          <br />
          <a href="https://books.google.com/books" target="_blank">
            Google Booksサイト
          </a>
          のページURLから取得できます。
          <br />
          例: https://books.google.com/books?uid=<span>123456789</span>
        </p>
        <form onSubmit={handleSetUserId}>
          <input type="text" name="userId" placeholder="123456789" required />
          <button type="submit" aria-label="Google BooksユーザーID設定">
            設定
          </button>
        </form>
      </dialog>

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
