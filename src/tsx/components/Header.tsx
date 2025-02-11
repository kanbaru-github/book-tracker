import { useEffect } from "react";
import "../../scss/components/Header.scss";
import { LibraryBig, Search } from "lucide-react";

const fixedHeader = () => {
  addEventListener("scroll", () => {
    const header = document.querySelector(".header");
    if (header) {
      if (scrollY > 0) {
        header.classList.add("header--fixed");
      } else {
        header.classList.remove("header--fixed");
      }
    }
  });
};

const smoothScroll = () => {
  console.log(1);
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", e => {
      e.preventDefault();

      const header = document.querySelector("header");
      const href = anchor.getAttribute("href");
      if (header && href) {
        const target = document.getElementById(href.replace("#", ""));
        if (target) {
          const headerHeight = header.offsetHeight
          const targetPosition = target.offsetTop - headerHeight;
          console.log(targetPosition);
          scrollTo({
            top: targetPosition,
            behavior: "smooth",
          });
        }
      }
    });
  });
};

const Header = () => {
  useEffect(() => {
    fixedHeader();
    smoothScroll();
  }, []);

  return (
    <header className="header">
      <nav className="header__nav">
        <h2 className="header__nav-logo">
          <a href="#root">BOOK TRACKER</a>
        </h2>
        <ul className="header__links">
          <li>
            <a href="#book-search">
              <Search size={16} />
              書籍検索
            </a>
          </li>
          <li>
            <a href="#bookshelf">
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
