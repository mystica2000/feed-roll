import { createEffect, createSignal } from "solid-js";
import FaSolidArrowUp from "../assets/icons/arrowup";

function ScrollToTop() {

  const [scrollToTop, setScrollToTop] = createSignal(false);

  createEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        setScrollToTop(true);
      } else {
        setScrollToTop(false);
      }
    })
  });


  const scrollUp = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    })
  }

  return (
    <Show
      when={scrollToTop()}
      fallback={""}
    >
      <button onClick={scrollUp} className="btn">
       <FaSolidArrowUp />
      </button>
    </Show>
  );
}

export default ScrollToTop;
