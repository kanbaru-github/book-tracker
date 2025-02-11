import BookSearch from "./components/BookSearch";
import Bookshelf from "./components/Bookshelf";
import MainVisual from "./components/MainVisual";
import "../scss/App.scss";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />

      <main className="max-w-6xl mx-auto p-4">
        <MainVisual />

        <BookSearch />

        <Bookshelf />
      </main>
    </>
  );
}

export default App;
