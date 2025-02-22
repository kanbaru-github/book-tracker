import { useState } from "react";
import { Search } from "lucide-react";
import { GoogleBook } from "../../ts/types/google_book";
import "../../scss/components/BookSearch.scss";
import BookList from "./BookList";
import Loading from "./Loading";

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GoogleBook[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const searchBooks = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query,
        )}&maxResults=10`,
      );
      const data = await response.json();
      setResults(data.items || []);
    } catch (err) {
      console.error("Error searching books:", err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <section className="book-search" id="book-search">
      <h2>
        <Search size={24} />
        書籍検索
      </h2>

      <div className="book-search__input-container">
        <input
          type="text"
          name="search"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => e.key === "Enter" && searchBooks()}
          placeholder="書籍名や著者名で検索..."
        />
        <button
          onClick={searchBooks}
          disabled={isSearching}
          aria-label="書籍検索実行"
        >
          <Search size={15} />
        </button>
      </div>

      {isSearching ? <Loading /> : <BookList books={results} />}
    </section>
  );
};

export default BookSearch;
