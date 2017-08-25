
const express = require('express');
const app = express();
const request = require("request");
const apiUrl = "https://api.imgur.com/3/gallery/search/?client_id="+ process.env.client_id+"&sort=top";
const mongoUrl = "mongodb://"+process.env.dbuser+":"+process.env.dbpassword+"@"+process.env.hostportdbname
const mongo = require("mongodb").MongoClient;

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
    offset = parseInt(offset);

    for(var i= 0 + offset; i < offset + 10; i++){
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

function recordSearch(query, callback){//send search query and timestamp to db. 
  mongo.connect(mongoUrl, (err, db) =>{
    if(err) throw err; 
    console.log("db connection successful");
    var queries = db.collection("queries");
    var queryObject = {query:query, date: new Date().toUTCString()};
    queries.insert(queryObject)
    db.close();
  });
  
}//end recordSearch


// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get("/search/", (req, res)=>{
  var query = req.query.q; 
  var offset = Boolean(req.query.offset)? req.query.offset:0 ; //number of items to retieve
  var url  = apiUrl+"&q="+query;
  var useJSONP = Boolean(req.query.callback);
  recordSearch(query);
  getImages(query,offset,url, useJSONP, res);
});

app.get("/recent/", (req, res)=>{
  var useJSONP = Boolean(req.query.callback);
  mongo.connect(mongoUrl, (err, db) =>{
    if (err) throw err; 
    var queries=db.collection("queries");
    queries.find({}, {_id:0}).sort({_id:-1}).limit(10).toArray((err, docs) =>{
      if (err) throw err; 
      
      (useJSONP) ? res.jsonp(docs).end() : res.json(docs).end;
    });
  });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
