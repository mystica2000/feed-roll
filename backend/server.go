package main

import (
	"encoding/json"


	"io"
	"net/http"
	"log"
	"io/ioutil"

	"sort"
	"strings"

	// "sync"

	"github.com/itchyny/timefmt-go"
	"github.com/mmcdole/gofeed"
	"github.com/robfig/cron/v3"

	"time"
)

type Feed struct {
	Title         string    `json:"title"`
	PublishedDate time.Time `json:"publishedDate"`
	Link          string    `json:"link"`
	Name          string    `json:"name"`
}

func containsDay(temp string) bool {
	arr := []string{"Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun", "mon", "tue", "wed", "thu", "fri", "sat", "sun"}

	for _, str := range arr {
		if strings.Contains(temp, str) {
			return true
		}
	}
	return false
}

func replaceSingleNumber(str string) string {
	temp := []string{" 0 ", " 1 ", " 2 ", " 3 ", " 4 ", " 5 ", " 6 ", " 7 ", " 8 ", " 9 "}

	for i, _ := range temp {
		if strings.Contains(str, temp[i]) == true {
			str = strings.Replace(str, temp[i], " 0"+strings.TrimSpace(temp[i])+" ", 1)
		}
	}

	return str
}


func dateConverter(fullDate string) time.Time {


	if strings.Contains(fullDate, "-") && !containsDay(fullDate) {

		fullDate = strings.Replace(fullDate, " ", "T", 1)
		fullDate = fullDate + "Z"

		ret, _ := time.Parse(time.RFC3339, fullDate)

		return ret
	} else if containsDay(fullDate) {

		var t time.Time

		// fullDate = strings.ReplaceAll("-0","-0","") //-0500, -0400

		if strings.Contains(fullDate, "-0") && !strings.Contains(fullDate, "GMT") {

			index := strings.Index(fullDate, "-0")
			removeStr := fullDate[index : index+5]

			str := strings.ReplaceAll(fullDate, removeStr, "GMT")
			fullDate = replaceSingleNumber(str)
		}

		if strings.Contains(fullDate, "GMT") {
			t, _ = time.Parse(time.RFC1123, fullDate)
		} else {
			t, _ = time.Parse(time.RFC1123Z, fullDate)
		}

		str := t.String()
		if strings.Contains(str, "+0000") {
			str = strings.ReplaceAll(str, "+0000", "")
		}

		if strings.Contains(str, "-0700") {
			str = strings.ReplaceAll(str, "-0700", "")
		}

		if strings.Contains(str, "GMT") {
			str = strings.ReplaceAll(str, "GMT", "")
		}

		str = strings.Replace(str, " ", "T", 1)
		str = strings.TrimSpace(str) + "Z"

		ret, _ := time.Parse(time.RFC3339, str)



		return ret

	} else {

		t, _ := timefmt.Parse(fullDate, "%a, %d %b %Y %T %z")

		str := t.String()

		if strings.Contains(str, "+0000") {
			str = strings.ReplaceAll(str, "+0000", "")
		}

		str = strings.Replace(str, " ", "T", 1)
		str = strings.TrimSpace(str) + "Z"

		ret, _ := time.Parse(time.RFC3339, str)



		return ret

	}
}

func main() {

	urls := make(map[string]string)
	urls["meta"] = "https://engineering.fb.com/feed/"
	urls["uber"] =	"https://www.uber.com/en-IN/blog/rss/"
	urls["github"] =	"https://github.blog/category/engineering/feed/"
	urls["uber"] =	"https://www.uber.com/en-IN/blog/rss/"
	urls["dropbox"] =	"https://dropbox.tech/feed"
	urls["pinterest"] =	"https://medium.com/feed/@Pinterest_Engineering"
	urls["etsy"] =	"https://www.etsy.com/codeascraft/rss"
	urls["stackoverflow"] =	"https://stackoverflow.blog/feed/"
	urls["linkedin"] =	"https://engineering.linkedin.com/blog.rss.html"
	urls["netflix"] =	"https://netflixtechblog.com/feed"
	urls["spotify"] =	"https://engineering.atspotify.com/feed/"

	fp := gofeed.NewParser()


	c := cron.New()
	c.AddFunc("@every 23h", func ()  {


		var total []Feed
		temp := make(map[string]struct{})

		for url := range urls {

			feed, err := fp.ParseURL(urls[url])

			if err != nil {
				log.Fatal(err)
			}

			items := feed.Items

			for i := 0; i < len(items); i++ {

				dateResult := dateConverter(items[i].Published)

				if _, ok := temp[items[i].Title]; ok {

				} else {
					temp[items[i].Title] = struct{}{}

					total = append(total, Feed{items[i].Title, dateResult, items[i].Link,url})
				}
			}

		}

		sort.Slice(total, func(i, j int) bool {
			return total[i].PublishedDate.After(total[j].PublishedDate)
		})


		j, _ := json.Marshal(total)


		err := ioutil.WriteFile("feed.json", []byte(string(j)), 0644)
		if err != nil {
		log.Fatal(err)
		}


	})


	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {

		// w.Header().Set("Access-Control-Allow-Origin", "https://feed-roll.vercel.app")

		(w).Header().Set("Access-Control-Allow-Origin", "*")
    (w).Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
    (w).Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization")


		content ,err := ioutil.ReadFile("feed.json")
		if err != nil {
		log.Fatal(err)
		}

		io.WriteString(w, string(content))
	})

	c.Start()
	log.Fatal(http.ListenAndServe(":8080", nil))






}
