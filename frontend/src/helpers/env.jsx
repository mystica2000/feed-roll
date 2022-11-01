export function apiURL() {

  let API_URL = ""
  if (import.meta.env.DEV) {
    API_URL = "http://localhost:8080"
  } else {
    API_URL = "https://feed-roll-io.fly.dev/"
  }

  return API_URL;

}