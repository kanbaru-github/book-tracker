import { useCallback, useEffect, useRef, useState } from "react";
import { GoogleBook } from "../../ts/types/google_book";
import { BOOKSHELF_IDS } from "../../ts/constants/google_book";
import "../../scss/components/Bookshelf.scss";
import BookList from "./BookList";
import { CircleX, Filter, LibraryBig, Save } from "lucide-react";

const Bookshelf = () => {
  const [books, setBooks] = useState<GoogleBook[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [shelfId, setShelfId] = useState(0);
  const [filteredBooks, setFilteredBooks] = useState<GoogleBook[]>([]);
  const [filterText, setFilterText] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);

  // 1. ユーザーIDをローカルストレージから取得 無ければdialogを表示して登録を促す
  useEffect(() => {
    const storedUserId = localStorage.getItem("googleBooksUserId");
    if (storedUserId) {
      setUserId(storedUserId);
    } else {
      setIsDialogOpen(true);
    }
  }, []);

  // FIXME:別課題で可変になるように修正
  const maxResults = 40;

  useEffect(() => {
    /**
     * Google Books APIを利用し公開書棚を取得
     */
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.googleapis.com/books/v1/users/${userId}/bookshelves/${shelfId}/volumes?maxResults=${maxResults}`,
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
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
  }, [userId, shelfId]);

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
    if (!userId) return;
    if (!confirm(`ユーザーIDを削除しますか？\nID: ${userId}`)) return;

    localStorage.removeItem("googleBooksUserId");
    setUserId(null);
    setIsDialogOpen(true);
  };

  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (isDialogOpen) {
      inputRef.current?.focus();
      document.body.classList.add("dialog-open");
    } else {
      document.body.classList.remove("dialog-open");
    }
  }, [isDialogOpen]);

  // filteredBooksの内容が変わるたびにcategoriesを更新
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(
        filteredBooks.reduce((acc: string[], book) => {
          const bookCategories = book.volumeInfo.categories || [];
          return acc.concat(bookCategories);
        }, []),
      ),
    );
    setCategories(uniqueCategories);
  }, [filteredBooks]);

  /**
   * フィルター処理(メモ化)
   */
  const handleFilterBooks = useCallback(() => {
    const searchText = filterText.toLowerCase();
    const filtered = books.filter(book => {
      const title = book.volumeInfo.title.toLowerCase();
      const author = book.volumeInfo.authors?.join(" ") || "";
      const description = book.volumeInfo.description || "";
      const categories = book.volumeInfo.categories || [];

      const isMatchedText =
        title.includes(searchText) ||
        author.toLowerCase().includes(searchText) ||
        description.toLowerCase().includes(searchText);

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
          ユーザーID 削除
          <CircleX size={18} />
        </button>
      )}

      <dialog
        open={isDialogOpen}
        className="bookshelf__dialog"
        aria-modal="true"
      >
        <h3 aria-labelledby="dialog-title">
          Google BooksのユーザーIDを入力してください。
        </h3>
        <p aria-labelledby="dialog-description">
          <a
            href="https://books.google.com/books"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Google Booksサイトを新しいタブで開く"
          >
            Google Booksサイト
          </a>
          のページURLから取得できます。
          <br />
          例: https://books.google.com/books?uid=<span>123456789</span>
        </p>
        <form onSubmit={handleSetUserId}>
          <input
            type="text"
            inputMode="numeric"
            pattern="\d+"
            name="userId"
            placeholder="123456789"
            required
            aria-required="true"
          />
          <button type="submit" aria-label="Google BooksユーザーID設定">
            <Save size={16} />
          </button>
        </form>
      </dialog>

      <form className="bookshelf__choice">
        <fieldset>
          <legend>
            書棚選択
            <LibraryBig size={16} />
          </legend>
          <select
            value={shelfId}
            onChange={e => setShelfId(Number(e.target.value))}
            aria-label="書棚選択"
          >
            {Object.entries(BOOKSHELF_IDS).map(([id, name]) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
          </select>
        </fieldset>
      </form>

      <form className="bookshelf__filter">
        <fieldset>
          <legend>
            書棚内検索
            <Filter size={16} />
          </legend>

          <label htmlFor="filter-text">Title / Author / Description</label>
          <input
            type="text"
            placeholder="キーワードを入力"
            id="filter-text"
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
          />

          <label htmlFor="filter-category">Category</label>
          <select
            id="filter-category"
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
