Welcome to ImgSirch
=========================

Use the API to search for images on imgur and get an array response containing a direct link, an image description, and the URL to the page which contains the image. Each element of the array is an object in JSON.  

Use `https://imgsirch.glitch.me/search/` 

Accepted parameters are `q` for query, `offset` for the pagination of results you wish to receive(each call returns 10 results. To get a new set of images then add 10 to the current offset. offset = 10. offset = 20 and so forth), and `callback` for a response in JSONP. 

## Example

GET `https://imgsirch.glitch.me/search/?q=forest&offset=10`

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
  }, ... 7 more image objects
]
```

To get a JSONP response just add `&callback=?` to the url.

### To do
- [x] Add search capability
- [x] Add pagination capability
- [ ] Add recent search lookup