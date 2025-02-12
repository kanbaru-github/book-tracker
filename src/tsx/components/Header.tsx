import { useEffect, useState } from "react";
import "../../scss/components/Header.scss";
import { LibraryBig, Search } from "lucide-react";

const Header = () => {
  const [isFixed, setIsFixed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(scrollY > 0);
    };

    addEventListener("scroll", handleScroll);
    return () => removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${isFixed ? "header--fixed" : ""}`}>
      <nav className="header__nav">
        <h2 className="header__nav-logo">
          <a href="#root" aria-label="ページ最上部へ移動">
            BOOK TRACKER
          </a>
        </h2>
        <ul className="header__links">
          <li>
            <a href="#book-search" aria-label="書籍検索セクションへ移動">
              <Search size={16} />
              書籍検索
            </a>
          </li>
          <li>
            <a href="#bookshelf" aria-label="書棚セクションへ移動">
              <LibraryBig size={16} />
              書棚
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
