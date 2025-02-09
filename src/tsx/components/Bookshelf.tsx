import { useCallback, useEffect, useState } from "react";
import { GoogleBook } from "../../ts/types/google_book";
import { HAVE_READ_SHELF_ID } from "../../ts/constants/google_book";
import "../../scss/components/Bookshelf.scss";
import BookList from "./BookList";

const Bookshelf = () => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filteredBooks, setFilteredBooks] = useState<GoogleBook[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const maxResults = 40;

  // 1. ユーザーIDをローカルストレージから取得 無ければdialogを表示して登録を促す
  useEffect(() => {
    const storedUserId = localStorage.getItem("googleBooksUserId");
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
          `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${HAVE_READ_SHELF_ID}/volumes?maxResults=${maxResults}`
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
      localStorage.setItem("googleBooksUserId", newUserId);
      setUserId(newUserId);
      setIsDialogOpen(false);
    }
  };

  const removeUserId = () => {
    if (!confirm(`ユーザーIDを削除しますか？\nID: ${userId}`)) return;

    localStorage.removeItem("googleBooksUserId");
    setUserId(null);
    setIsDialogOpen(true);
  };

  useEffect(() => {
    if (isDialogOpen) {
      const dialog = document.querySelector(
        ".bookshelf__dialog"
      ) as HTMLDialogElement;
      dialog.querySelector("input")?.focus();
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isDialogOpen]);

  /** 一意のカテゴリー配列 */
  const categories = Array.from(
    new Set(
      books.reduce((acc: string[], book) => {
        const bookCategories = book.volumeInfo.categories || [];
        return acc.concat(bookCategories);
      }, [])
    )
  );

  /**
   * フィルター処理(メモ化)
   */
  const handleFilterBooks = useCallback(() => {
    const filtered = books.filter(book => {
      const title = book.volumeInfo.title.toLowerCase();
      const author = book.volumeInfo.authors?.join(" ") || "";
      const description = book.volumeInfo.description || "";
      const categories = book.volumeInfo.categories || [];

      const isMatchedText =
        title.includes(filterText.toLowerCase()) ||
        author.toLowerCase().includes(filterText.toLowerCase()) ||
        description.toLowerCase().includes(filterText.toLowerCase());

      const isMatchedCategory = filterCategory
        ? categories.includes(filterCategory)
        : true;

      return isMatchedText && isMatchedCategory;
    });

    setFilteredBooks(filtered);
  }, [filterText, filterCategory, books]);

  useEffect(() => {
    handleFilterBooks();
  }, [filterText, filterCategory, books, handleFilterBooks]);

  return (
    <section className="bookshelf">
      <h2>書棚</h2>

      {isDialogOpen || (
        <button
          onClick={removeUserId}
          className="bookshelf__deleteBtn"
          aria-label="Local StorageからGoogle BooksユーザーID削除"
        >
          ユーザーIDを削除
        </button>
      )}

      <dialog open={isDialogOpen} className="bookshelf__dialog">
        <p>
          Google BooksのユーザーIDを入力してください。
          <br />
          <a
            href="https://books.google.com/books"
            target="_blank"
            rel="noopener noreferrer"
          >
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

      <form className="bookshelf__filter">
        <fieldset>
          <legend>書棚内検索</legend>

          <label>Title, Author, Description検索</label>
          <input
            type="text"
            placeholder="キーワードを入力"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />

          <label>Category検索</label>
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
          >
            <option value="">選択してください</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </fieldset>
      </form>

      {loading ? (
        <div className="loading" role="status" aria-live="polite">
          読み込み中...
        </div>
      ) : error ? (
        <div className="error" role="alert" aria-live="assertive">
          {error}
        </div>
      ) : (
        <BookList books={filteredBooks} />
      )}
    </section>
  );
};

export default Bookshelf;
