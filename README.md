Welcome to ImgSirch
=========================

Use the API to search for images on imgur and get an array response containing a direct link, and image description, and the URL to the page which contains the image. Each element of the array is an object in JSON.  

Use `https://imgsirch.glitch.me/search/` 

Accepted parameters are `q` for query, `offset` for the number of results you wish to receive, and `callback` for a response in JSONP. 

## Example

GET `https://imgsirch.glitch.me/search/?q=forest&offset=3`

Response:
```
[
  {
    "image": "http://i.imgur.com/AuSS2zq.jpg",
    "description": "#terrarium",
    "page": "http://i.imgur.com/AuSS2zq"
  },
  {
    "image": "http://i.imgur.com/OGIvoQF.jpg",
    "description": "#creepy #funny #nature #hiking",
    "page": "http://i.imgur.com/OGIvoQF"
  },
  {
    "image": "http://i.imgur.com/5HjhXdA.jpg",
    "description": "Her floof is super soft and silky. Hypoallergenic and doesn't really shed.",
    "page": "http://i.imgur.com/5HjhXdA"
  }
]
```

To get a JSONP response just add `&callback=?` to the url.