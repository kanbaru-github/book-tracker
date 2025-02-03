import BookSearch from "./components/BookSearch";
import BookList from "./components/BookList";
import reactLogo from './assets/react.svg'
import './scss/App.scss'

function App() {
  return (
    <div className="max-w-6xl mx-auto p-4">
      <h1>
        <img src={reactLogo} alt="React logo" />
        BOOK TRACKER
      </h1>

      <BookSearch />

      <BookList />
    </div>
  );
}

export default App
