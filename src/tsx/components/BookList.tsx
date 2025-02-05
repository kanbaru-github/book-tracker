import { useState } from "react";
import { GoogleBook } from "../../types/google_book";
import { Copy } from "lucide-react";
import "../../scss/components/BookList.scss";

type BookListProps = {
  books: GoogleBook[];
};

const BookList = ({ books }: BookListProps) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <ul className="book-list">
      {books.map((book) => (
      <li key={book.id}>
        {book.volumeInfo.imageLinks?.thumbnail && (
          <img
            src={book.volumeInfo.imageLinks.thumbnail}
            alt={book.volumeInfo.title}
          />
        )}
        <h3>{book.volumeInfo.title}</h3>
        <p className="author">
          {book.volumeInfo.authors?.join(", ") || "著者不明"}
        </p>
        <p className="category">
          {book.volumeInfo.categories?.join(", ") || "カテゴリ不明"}
        </p>
        <div className="id-wrapper">
          <code>{book.id}</code>
          <button
            onClick={() => copyToClipboard(book.id)}
            title="IDをコピー"
          >
            <Copy size={16} />
          </button>
          {copiedId === book.id && <span>コピーしました</span>}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
