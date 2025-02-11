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

  return (
    <>
      <Header />

      <main>
        <MainVisual />

        <BookSearch />

        <Bookshelf />
      </main>

      <a href="#" className={`toTopBtn ${!isTop ? "toTopBtn--show" : ""}`}>
        <ArrowUp size={24} />
      </a>
    </>
  );
}

export default App;
