import { GoogleBook } from "../../ts/types/google_book";
import { ExternalLink, ShoppingBasket } from "lucide-react";
import "../../scss/components/BookList.scss";

type BookListProps = {
  books: GoogleBook[];
};

const BookList = ({ books }: BookListProps) => {
  return (
    <ul className="book-list">
      {books.map(book => (
        <li key={book.id}>
          {book.volumeInfo.imageLinks?.thumbnail && (
            <img
              src={book.volumeInfo.imageLinks.thumbnail}
              alt={book.volumeInfo.title}
              loading="lazy"
            />
          )}

          {book.saleInfo.saleability === "FOR_SALE" && (
            <a
              href={book.saleInfo.buyLink}
              className="book-list__sale"
              target="_blank"
              rel="noopener noreferrer"
            >
              SALE!!
              <ShoppingBasket size={16} />
            </a>
          )}

          <h3>
            <a
              href={book.volumeInfo.infoLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {book.volumeInfo.title}
              <ExternalLink size={16} />
            </a>
          </h3>

          <p className="author">
            {book.volumeInfo.authors?.join(", ") || "著者不明"}
          </p>
          <p className="category">
            {book.volumeInfo.categories?.join(", ") || "カテゴリ不明"}
          </p>
          <p className="description">
            {book.volumeInfo.description || "説明不明"}
          </p>
        </li>
      ))}
    </ul>
  );
};

export default BookList;
