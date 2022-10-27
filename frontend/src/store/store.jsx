import { createSignal,createRoot } from "solid-js";


function createSearch() {
  const [search, setSearch] = createSignal("");

  const handleSearchChange = (e) => {

    let val = e.target.value;

    setSearch(e.target.value.toLowerCase().trim());
  }

  return { search, handleSearchChange };
}

export default createRoot(createSearch);