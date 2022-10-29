import { createEffect, createResource, createSelector, createSignal, onMount } from "solid-js";
import store from "../store/store";
import convertedDateFunc from "../helpers/sort"
import ScrollToTop from "./ScrollToTop";
import NoResults from "./NoResults";

const SEARCH = 1;
const DEFAULT = 2;


const fetchPost = async () => { return (await fetch(`https://feed-roll-io.fly.dev/`)).json() };



function Content() {

  const { search } = store
  const [posts] = createResource(fetchPost)
  const [loading, setLoading] = createSignal(false);
  let postsMap = new Map();
  let postsMapInitial = new Map();

  createEffect(() => {
    if (posts()) {
      fetchPosts();
    }
  })


  const populateMap = () => {
    let arr = []

    for (const [key, value] of postsMap.entries()) {
      arr.push(<p className="circle">{key}</p>)

      for (let i = 0; i < value.length; i++) {
        arr.push(
          <>
            <a className="square" href={value[i].link} target="_blank">{value[i].title}</a>
            <span className="box">{value[i].name}</span>
          </>
        )
      }
    }

    let arr1 = []
    arr1.push(<div className="side">{arr}</div>)

    return arr1;
  }

  const modifyStructure = (opt) => {

    switch (opt) {
      case SEARCH: {
        postsMap = new Map(postsMapInitial)
        let map = new Map();
        postsMap.forEach((val, key) => {
          for (let i = 0; i < val.length; i++) {
            if (val[i].name.includes(search())) {
              if (map.has(key)) {
                let temp = map.get(key);
                temp.push(val[i])
                map.set(key, temp)
              } else {
                map.set(key, [val[i]])
              }
            }
          }
        })
        postsMap = new Map(map)

        if (postsMap.size > 0) {
          return populateMap();
        } else {
          return <NoResults />
        }
      }
      case DEFAULT: {


        if (loading()) {
          postsMap = new Map(postsMapInitial)
        } else {
          fetchPosts()
        }
        return populateMap();
      }
    }
  }




  const fetchPosts = () => {

    if (typeof(posts())=='object') {

      postsMapInitial = new Map();
      postsMap = new Map()
      for (let i = 0; i < posts().length; i++) {
        let convertedDate = new Intl.DateTimeFormat("en", { month: "short", day: "2-digit", year: "numeric" }).format(new Date(posts()[i].publishedDate))

        if (postsMap.has(convertedDate)) {
          let temp = postsMap.get(convertedDate);
          temp.push(posts()[i])
          postsMap.set(convertedDate, temp)
        } else {
          postsMap.set(convertedDate, [posts()[i]])
        }
      }
      postsMap = new Map(convertedDateFunc(postsMap))
      postsMapInitial = new Map(postsMap);

      setLoading(true);
    } else {

    }
  }

  return (
    <>
      <main style={"min-height:73vh;margin-top:200px;"}>
        <ScrollToTop />

        <ErrorBoundary fallback={<h1>Something went wrong! Try again later...</h1>}>
          { posts.loading && <h1>Loading...</h1>}
          <Show when={search().length > 0} fallback={modifyStructure(DEFAULT)}>
            {modifyStructure(SEARCH)}
          </Show>
        </ErrorBoundary>

      </main>
    </>
  );
}

export default Content;
