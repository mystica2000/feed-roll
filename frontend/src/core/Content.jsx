import { createEffect, createResource } from "solid-js";
import store from "../store/store";


const SEARCH = 1;

const fetchPost = async () => (await fetch(`http://localhost:8080`).then((response) => {
  return response.json()
}));


function Content() {

  const { search } = store

  const [posts] = createResource(fetchPost)

  let postsMap = new Map();
  let postsMapInitial = new Map();

  const populateMap = () => {
    let arr = []
    for (const [key, value] of postsMap.entries()) {
      arr.push(<p className="circle">{key}</p>)

      for (let i = 0; i < value.length; i++) {
        arr.push(
          <>
            <a className="square" href={value[i].link}>{value[i].title}</a>
            <span className="box">{value[i].name}</span>
          </>
        )
      }
    }

    return arr;
  }

  const modifyStructure = (opt) => {

    if (posts()) {

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

          if(postsMap.size>0) {
            return populateMap();
          } else {
            return <div>No results Found</div>
          }

        }
        default: {
          fetchPosts();
          return populateMap();
        }
      }
    }
  }




  const fetchPosts = () => {

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

    postsMapInitial = new Map(postsMap);
  }

  return (
    <>
      <div >
        <div className="side">

        <Suspense fallback={<h1>Loading...</h1>}>
          <Show
            when={search().length > 0}
            fallback={modifyStructure()}
          >
            {modifyStructure(SEARCH)}
          </Show>
        </Suspense>

        </div>
      </div>
    </>
  );
}

export default Content;
