import BookSearch from "./components/BookSearch";
import Bookshelf from "./components/Bookshelf";
import "../scss/App.scss";

function App() {
  return (
    <main className="max-w-6xl mx-auto p-4">
      <h1>BOOK TRACKER</h1>

      <Error/>

      <BookSearch />

      <Bookshelf />
    </main>
  );
}

export default App;
