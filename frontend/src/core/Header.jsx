import store from "../store/store";

function Search() {

  const {search,handleSearchChange} = store

  return <input value={search()} onKeyUp={handleSearchChange} className="search" placeholder="github,uber,meta"/>
}

function Header() {

  return (
    <div className="header">
        <h1>Feed Roll 📰</h1>
        <p>RSS Feeds from Engineering Blogs at One Place! ✨</p>
        <Search />
    </div>
  );
}

export default Header;
