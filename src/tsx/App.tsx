import BookSearch from "./components/BookSearch";
import Bookshelf from "./components/Bookshelf";
import MainVisual from "./components/MainVisual";
import "../scss/App.scss";
import Header from "./components/Header";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

function App() {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    const handleIsTop = () => {
      setIsTop(scrollY === 0);
    };

    handleIsTop();
    addEventListener("scroll", handleIsTop);
  }, []);

  const handleToTopBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <Header />

      <main>
        <MainVisual />

        <BookSearch />

        <Bookshelf />
      </main>

      <button
        className={`toTopBtn ${!isTop ? "toTopBtn--show" : ""}`}
        onClick={handleToTopBtn}
        aria-label="ページトップへ戻る"
      >
        <ArrowUp size={24} />
      </button>
    </>
  );
}

export default App;
