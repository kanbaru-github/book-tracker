import { useState } from "react";
import { Search, Copy } from "lucide-react";

type SearchBookResult = {
  id: string;
  volumeInfo: {
    title: string;
    authors?: string[];
    imageLinks?: {
      thumbnail: string;
    };
    categories?: string[];
    description?: string;
  };
};

const BookSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchBookResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const searchBooks = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=10`
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
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
          placeholder="書籍名や著者名で検索..."
          className="flex-1 p-2 border rounded-lg"
        />
        <button
          onClick={searchBooks}
          disabled={isSearching}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300"
        >
          <Search size={20} />
        </button>
      </div>

      {isSearching ? (
        <div className="text-center py-4">検索中...</div>
      ) : (
        <div className="space-y-4">
          {results.map((book) => (
            <div key={book.id} className="flex gap-4 p-4 border rounded-lg">
              {book.volumeInfo.imageLinks?.thumbnail && (
                <img
                  src={book.volumeInfo.imageLinks.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-24 h-32 object-cover"
                />
              )}
              <div className="flex-1">
                <h3 className="font-semibold">{book.volumeInfo.title}</h3>
                <p className="text-sm text-gray-600">
                  {book.volumeInfo.authors?.join(", ") || "著者不明"}
                </p>
                {book.volumeInfo.categories && (
                  <p className="text-sm text-blue-600 mt-1">
                    {book.volumeInfo.categories.join(", ")}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded text-sm">
                    {book.id}
                  </code>
                  <button
                    onClick={() => copyToClipboard(book.id)}
                    className="p-1 hover:bg-gray-100 rounded"
                    title="IDをコピー"
                  >
                    <Copy size={16} />
                  </button>
                  {copiedId === book.id && (
                    <span className="text-sm text-green-600">
                      コピーしました
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookSearch;
