package main

import (
	"encoding/json"
	"fmt"
	"os"

	"io"
	"io/ioutil"
	"log"
	"net/http"
	"sync"

	"github.com/mmcdole/gofeed"
	"github.com/robfig/cron/v3"
)

type Feed struct {
	Title         string `json:"title"`
	PublishedDate string `json:"publishedDate"`
	Link          string `json:"link"`
	Name          string `json:"name"`
}

var mutex sync.Mutex

func cronJob(wg *sync.WaitGroup) {

	fp := gofeed.NewParser()

	urls := make(map[string]string)
	urls["meta"] = "https://engineering.fb.com/feed/"
	urls["uber"] = "https://www.uber.com/en-IN/blog/rss/"
	urls["github"] = "https://github.blog/category/engineering/feed/"
	urls["uber"] = "https://www.uber.com/en-IN/blog/rss/"
	urls["dropbox"] = "https://dropbox.tech/feed"
	urls["pinterest"] = "https://medium.com/feed/@Pinterest_Engineering"
	urls["etsy"] = "https://www.etsy.com/codeascraft/rss"
	urls["stackoverflow"] = "https://stackoverflow.blog/feed/"
	urls["linkedin"] = "https://engineering.linkedin.com/blog.rss.html"
	urls["netflix"] = "https://netflixtechblog.com/feed"
	urls["spotify"] = "https://engineering.atspotify.com/feed/"

	c := cron.New()
	c.AddFunc("0 0 * * *", func() {

		var total []Feed
		temp := make(map[string]struct{})

		for url := range urls {
			feed, err := fp.ParseURL(urls[url])
			if err != nil {
				log.Fatal(err)
			}

			items := feed.Items

			for i := 0; i < len(items); i++ {

				dateResult := items[i].Published

				if _, ok := temp[items[i].Title]; ok {

				} else {
					temp[items[i].Title] = struct{}{}

					total = append(total, Feed{items[i].Title, dateResult, items[i].Link, url})
				}
			}
		}
		j, _ := json.Marshal(total)
		fmt.Println("Hello world!!")
		mutex.Lock()
		err := ioutil.WriteFile("feed.json", []byte(string(j)), 0644)
		if err != nil {
			log.Fatal(err)
		}
		mutex.Unlock()
	})

	c.Start()
}

func startHTTPServer(wg *sync.WaitGroup) {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		fmt.Print("working??")
		//https://feed-roll.vercel.app
		(w).Header().Set("Access-Control-Allow-Origin", "*")
		(w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		(w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")

		mutex.Lock()
		content, err := ioutil.ReadFile("feed.json")

		if err != nil {
			switch err {
			case os.ErrInvalid:
				{
					io.WriteString(w, "Not found Invalid")
				}
			case os.ErrPermission:
				{
					io.WriteString(w, "Not found Permission")
				}
			case os.ErrNotExist:
				{
					io.WriteString(w, "Not found file")
				}
			default:
				{
					fmt.Println("Hello ",err)
				}
			}
		}
		mutex.Unlock()

		if len(content) > 1 {
			io.WriteString(w, string(content))
		} else {
			io.WriteString(w, "Server is Slow! Try Again Later")
		}

	})

	fmt.Println("Server listening on port 8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

func main() {

	var wg sync.WaitGroup
	wg.Add(2)

	go cronJob(&wg)
	go startHTTPServer(&wg)

	wg.Wait()

}
