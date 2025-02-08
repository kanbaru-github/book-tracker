import "../../scss/components/MainVisual.scss";

const MainVisual: React.FC = () => {
  return (
    <section className="main-visual">
      <h1>BOOK TRACKER</h1>
      <p className="main-visual__description">
        書棚拡張アプリ by
        <a href="https://books.google.co.jp/" target="_blank">
          Google ブックス
        </a>
      </p>
    </section>
  );
};

export default MainVisual;
