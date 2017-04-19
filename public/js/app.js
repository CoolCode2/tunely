/* CLIENT-SIDE JS
 *
 * You may edit this file as you see fit.  Try to separate different components
 * into functions and objects as needed.
 *
 */


/* hard-coded data! */
var sampleAlbums = [];
sampleAlbums.push({
             artistName: 'Ladyhawke',
             name: 'Ladyhawke',
             releaseDate: '2008, November 18',
             genres: [ 'new wave', 'indie rock', 'synth pop' ]
           });
sampleAlbums.push({
             artistName: 'The Knife',
             name: 'Silent Shout',
             releaseDate: '2006, February 17',
             genres: [ 'synth pop', 'electronica', 'experimental' ]
           });
sampleAlbums.push({
             artistName: 'Juno Reactor',
             name: 'Shango',
             releaseDate: '2000, October 9',
             genres: [ 'electronic', 'goa trance', 'tribal house' ]
           });
sampleAlbums.push({
             artistName: 'Philip Wesley',
             name: 'Dark Night of the Soul',
             releaseDate: '2008, September 12',
             genres: [ 'piano' ]
           });
/* end of hard-coded data */
///all of these are pushed into the array above


//when the doc loads run all these function
$(document).ready(function() {
    
    //sampleAlbums.forEach(function (sampleAlbums){
    //renderAlbum(sampleAlbums);

//ajax is getting the db.info.find() from the controller albums = "albums"
  var eachAlbumsSongs = []; //<--- each albums songs going in
  //console.log(eachAlbumsSongs);
  var songsVar = "";
  
  $.get('/api/albums', function(albums){
     // this ajax call is getting its info from the controller on the server.js page
     
    //albums is passed into the function as the 'thisAlbum' argument
    
    //console.log(albums[0].songs);//gets the songs from the first album in the albums array  "albums.songs"  won't work because it has no index
    //iterate over each album in the albums array
    albums.forEach(function(eachAlbum, index){
      renderAlbum(eachAlbum);
      buildSongsHtml(eachAlbum.songs);
    });
     // this the right place, 4 albums 7 songs
  });
 
 
  //grab the form data and serialize it
  
 $('#singlebutton').on("click", function(e){
    e.preventDefault();
    var serialData = $("#album-form").find("select,textarea, input").serialize();
    console.log("serialData: " + serialData);
    var inputFields = $("#album-form").find("select,textarea, input");
    
   // $('#album-form').trigger("reset"); --> doesnt work yet

    
   ////  serialDATA CAN BE USED DIRECTLY IN AJAX REQUEST  ////
   /// it doesnt need to be Parsed, jqery can take in the serialized data and knows what to do...
   //  BUT, it also cannot be PARSED b/c JSON.parse can only parse objects that are in string form.
    $.ajax({
      url: 'http://localhost:3000/api/albums',
      type: 'POST',
      data: serialData // <---- <-- - - < - - -
      //successfully updates DB
    })
    .done(function(){
        // go into the server, get all the albums, and render to page
        //just like the .forEach function at the top
        //and just like the route in the server
        $.get('/api/albums', function(res){
          res.forEach(function(thisAlbum){
            renderAlbum(thisAlbum);
            //console.log(thisAlbum.songs);
          });
        });
        
    });

  }); //Submit button function end 
$('#albums').on('click', '.add-song', function(e) {
    var id= $(this).parents('.album').data('album-id');
    $('#songModal').data('album-id', id);
    $('#songModal').modal();
  });

  $('#saveSong').on('click', handleNewSongSubmit);

});

$('#songModal').modal();





///444444444444444444444444444
// handles the modal fields and POSTing the form to the server
function handleNewSongSubmit(e) {
  var albumId = $('#songModal').data('album-id');
  var songName = $('#songName').val();
  var trackNumber = $('#trackNumber').val();

  var updateTrack = {
    name: songName,
    trackNumber: trackNumber
  };

  var stringForPost = '/api/albums/' + albumId + '/songs';
  

  $.post(stringForPost, updateTrack)
    .success(function(song) {
      // re-get full album and render on page
      $.get('/api/albums/' + albumId).success(function(album) {
        //remove the old album so there arent 2 on the page
        $('[data-album-id='+ albumId + ']').remove();
        renderAlbum(album);
      });

//this clears the tracknumber text input
      $('#trackNumber').val('');

//this clears the songname text input with an empty string
      
      $('#songName').val('');
//hide the modal
      $('#songModal').modal('hide');

    });
}
///444444444444444444444444444

  var buildSongsHtml = function(songs) {
  var eachSong = " -- ";

  songs.forEach(function(song) {

    eachSong = eachSong + "(" + song.trackNumber + ") " + song.name + " -- ";
  });
  var songsHtml  =
   "<li class='list-group-item'>" +
   "<h4 class='inline-header'>Songs:</h4>" +
   "<span>" + eachSong + "</span>" +
   "</li>";
  return songsHtml;
};

// this function takes a single album and renders it to the page
function renderAlbum(album) {
  //console.log('rendering album:', album);

  var albumHtml =
  "        <!-- one album -->" +
  "        <div class='row album' data-album-id='" + album._id + "'>" +
  "          <div class='col-md-10 col-md-offset-1'>" +
  "            <div class='panel panel-default'>" +
  "              <div class='panel-body'>" +
  "              <!-- begin album internal row -->" +
  "                <div class='row'>" +
  "                  <div class='col-md-3 col-xs-12 thumbnail album-art'>" +
  "                     <img src='" + "http://placehold.it/400x400'" +  " alt='album image'>" +
  "                  </div>" +
  "                  <div class='col-md-9 col-xs-12'>" +
  "                    <ul class='list-group'>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Album Name:</h4>" +
  "                        <span class='album-name'>" + album.name + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Artist Name:</h4>" +
  "                        <span class='artist-name'>" + album.artistName + "</span>" +
  "                      </li>" +
  "                      <li class='list-group-item'>" +
  "                        <h4 class='inline-header'>Released date:</h4>" +
  "                        <span class='album-name'>" + album.releaseDate + "</span>" +
  "                      </li>" +

                                buildSongsHtml(album.songs) +


  "                    </ul>" +
  "                  </div>" +
  "                </div>" +
  "                <!-- end of album internal row -->" +

  "              </div>" + // end of panel-body

  "              <div class='panel-footer'>" +
  "                <button class='btn btn-primary add-song'>Add Song</button>" +
  "              </div>" +

  "            </div>" +
  "          </div>" +
  "          <!-- end one album -->";
  //buildSongsHtml(album.songs);
//appending html to the div is what renders the page as is...
  // render to the page with jQuery
  
  //grab #albums id and add albumHtml to it
  $('#albums').append(albumHtml);


}
