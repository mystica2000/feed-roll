import store from "../store/store";

function Search() {

  const {search,handleSearchChange} = store

  return <input value={search()} onKeyUp={handleSearchChange} className="search" placeholder="github,uber,meta"/>
}

function Header() {

  return (
    <header className="header">
        <h1>Feed Roll 📰</h1>
        <p>RSS Feeds from Engineering Blogs at One Place! ✨</p>
        <Search />
    </header>
  );
}

export default Header;
