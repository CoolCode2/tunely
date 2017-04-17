// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
var bodyParser = require('body-parser');
// generate a new express app and call it 'app'
var app = express();

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

var db = require('./models');

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
/************
 * DATABASE *
 ************/

/* hard-coded data */




/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


/*
 * JSON API Endpoints
 */

app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
    
    db.Album.find({}, function(err, albums){
      //has to be lowercase
      res.json(albums);
    });
    
});

///////POST ROUTE  IS WORKING

app.post('/api/albums', function album_post(req,res){

  var postAlbum = new db.Album({
              artistName: req.body.artistName,
              name: req.body.name,
              releaseDate: req.body.releaseDate,
              genres: [req.body.genres]
  });
 
  postAlbum.save(function(err, album){
    res.json(req.body.name+" was added");
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
