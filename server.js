
const express = require('express');
const app = express();
const request = require("request");
const apiUrl = "https://api.imgur.com/3/gallery/search/?client_id="+ process.env.client_id+"&sort=top";


function imageObjectBuilder(albumImage, singleImage, callback){
  return Boolean(albumImage) ?{
    image:albumImage[0].link,
    description: Boolean(albumImage[0].description) ? albumImage[0].description : "Undescribed Image",
    page:"http://i.imgur.com/"+albumImage[0].id
  }:
  {
    image: singleImage.link,
    description: Boolean(singleImage.description)? singleImage.description : "Undescribed Image", 
    page: "http://i.imgur.com/"+ singleImage.id
  }
}

function getImages(query, offset, url, useJSONP, res, callback){
  request(url , (error, response, body)=>{
    if (error) throw error; 
    var dataArray = (JSON.parse(body)).data;
    var result=[];

    for(var i=0; i<offset; i++){
        if(dataArray[i].hasOwnProperty("is_album") && dataArray[i].is_album){//gets first image from an album
            let albumImage = Array.from(dataArray[i].images);
            result.push(imageObjectBuilder(albumImage));
          }else{//can access the link property directly since this element is not an album.
            result.push(imageObjectBuilder("", dataArray[i]));
          }
    }
    
    if(useJSONP)
      res.jsonp(result).end();
    else
      res.json(result).end();
    
  });
  
}

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/search/", (req, res)=>{
  var query = req.query.q; 
  var offset = req.query.offset; //number of items to retieve
  var url  = apiUrl+"&q="+query;
  var useJSONP = Boolean(req.query.callback);
  getImages(query,offset,url, useJSONP, res);
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
