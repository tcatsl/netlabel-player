// global variables
var c = 0;
var ua;
var android;
var safari = false
var iphone = false
var ipad = false
var play = [];
var filenames = [];
var playPause = 0;
var favorites = JSON.parse(localStorage.getItem("favorites4")) || []
var h;
var added = 0
// get 25 random releases from ids in netlabels.js
for (var i = 0; i< 24; i++) {
  var random = Math.floor(Math.random() * ids.length)
  play.push(ids[random])
}
//add to up next from favorites, increase added count
$(document).on("click", ".add", function(ev){
  added++
  var y = parseInt($(this).parent().attr("id"))
  filenames.splice(c+ added, 0, favorites[y])
  updatePlaylist();
  ev.stopPropagation();
})
//remove a track from favorites, write to localStorage and repopulate list
$(document).on("click", ".remove", function(ev){
  var y = parseInt($(this).parent().attr("id"))
  favorites.splice(y, 1)
  localStorage.setItem("favorites4", JSON.stringify(favorites));
  $('#fav').empty()
  $('#fav').html("click the <i class='material-icons favor'>favorite</i> button to save a track to favorites.<br>click on a track in favorites to load it into the player.<br><button class='playAll'>play all</button><button class='shuffleAll'>shuffle all</button><br><br>favorites:")
  for (var i = 0; i< favorites.length; i++){
    $('#fav').append("<li class='f' id="+i+"><button class='remove'>remove</button><button class='add'>add to up next</button>" +(favorites[i].artist || "untagged") + " - " + favorites[i].name + "</li>")
  };
  if (iphone == true || android == true){
    $('li').css("width", "376px")
    $('.chatmsg').css("width", "376px")
  }
  //reinitialize favorite buttons after rebuilding list
  $('.playAll').on("click", function(){
    for (var m = 0; m <favorites.length; m++){
    filenames.splice(c+1 + m, 0, favorites[m]);
    }
    updatePlaylist()
    $('#next').click()
  })
  $('.shuffleAll').on("click", function(){
    var next = [];
    for (var m = 0; m <favorites.length; m++){
    next.push(favorites[m]);
    }
    next.sort(function(a, b){
      a = Math.random();
  		b = Math.random();
  		return a-b
    })
    for (var dd = 0; dd <next.length; dd++){
    filenames.splice(c+1 + dd, 0, next[dd]);
    }
    updatePlaylist()
    $('#next').click()
  })
  //prevent from playing
  ev.stopPropagation();
})
//get random track metadata
for (var i = 0; i< 24; i++) {
  h = play[i]["identifier"]
  $.get("https://archive.org/metadata/"+ play[i]["identifier"], function(data){
  })
  .then(function(data){
    //prevent ios and safari from getting oggs
    if (iphone == false && safari == false && ipad == false){
      var files = data.files.filter(function(el, ind, arr){
        var re = /MP3/
        var re4 = /zip/i
        return el["format"] === "VBR MP3" || el["format"] === "Ogg Vorbis" || (re.test(el["format"]) && re4.test(el["format"] == false))
      })
    } else {
      var files = data.files.filter(function(el, ind, arr){
        var re = /MP3/
        var re4 = /zip/i
        return el["format"] === "VBR MP3" || (re.test(el["format"]) && re4.test(el["format"] == false))
      })
    }
    //resort to pngs only if no jpegs are present
    var images = data.files.filter(function(el, ind, arr){
      return el["format"] === "JPEG"
    })
    var x = files.length
    var o = images.length
    var imageNum = Math.floor(Math.random() * o)
    var number = Math.floor(Math.random() * x)
    if (o > 0){
      var img = images[imageNum]["name"]
    }  else {
      var images2 = data.files.filter(function(el, ind, arr){
        return el["format"] === "PNG" || el["format"] === "JPEG Thumb"
      })
      var o2 = images2.length
      var imageNum2 = Math.floor(Math.random() * o2)
      if (o2 > 0) {
      var img = images2[imageNum2]["name"]
      }
    }
    if (x > 0) {
      var name = files[number]["name"]
    }
    // console.log(files[number])
    // console.log(play[i])
    //provide blank image if none available
    //prepare data to push to playlist
    if (!!img){
    var imageurl = "https://archive.org/download/" + data.metadata.identifier + "/" + img}
    else {
      var imageurl = "https://placehold.it/400x300"
    };
    var url = "https://archive.org/download/" + data.metadata.identifier + "/" + name;
    var releaseurl = "https://archive.org/details/" + data.metadata.identifier
    var license = data.metadata.licenseurl
    if (!!name){
      //push to playlist if valid audio file was found
      filenames.push({'license': license, 'releaseurl': releaseurl, 'url': url, 'name': (files[number]["title"] || name || "untagged"), 'id': (files[number]["album"] || data.metadata.identifier || "untagged"), "artist": (files[number]["artist"] || data.metadata.creator || "untagged"), "date": data.metadata.publicdate, "img": imageurl});

      // update src, links, image, and metadata
      if ($('#player').attr("src") == ""){
        $('#player').attr("src", url)
        $('#art').attr("src", imageurl || "https://placehold.it/400x300")
        $('.download').attr("href", url)
        $('.release').attr('href', releaseurl || "https://archive.org/search.php?query=" + data.metadata.identifier);
        $('.license').attr('href', license || "please research this track before use");
        $('.meta').html('<p>track: ' + (files[number]["title"] || name || "untagged") +'<br>artist: ' + (files[number]["artist"] || data.metadata.creator || "untagged") + '<br>album: ' + (files[number]["album"] || data.metadata.title || "untagged") + '<br>date: ' +data.metadata.publicdate +'</p>')
      }
    } else {
      //get another file if no files found
      doTheThing()
    }
    updatePlaylist()
  })
  .catch(function(error){
    console.log(error)
  })
}
//make seekbar move
$('#player').on('timeupdate', function() {
  $('#seekbar').attr("value", this.currentTime / this.duration);
});
//add track to favorites, set localStorage
function likeIt(){
  favorites.push(filenames[c]);
  var id = favorites.length - 1;
  $('#fav').append("<li class='f' id="+ id+"><button class='remove'>remove</button><button class='add'>add to up next</button>" +(filenames[c].artist || "untagged") +" - "+ filenames[c].name + "</li>")
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  localStorage.setItem("favorites4", JSON.stringify(favorites))
}
//play the track and update data when clicking on a favorites item
$(document).on("click", ".f", function(){
  var y = $(this).attr("id")
  filenames.splice(c+1, 0, favorites[y]);
  c++;
  $('#player').attr('src',  favorites[y].url);
  $('#art').attr("src", favorites[y].img || "https:placehold.it/400x300");
  $('.download').attr('href', favorites[y].url);
  $('.license').attr('href', favorites[y].license || "please research this track before use");
  $('.release').attr('href', favorites[y].releaseurl || "https://archive.org/search.php?query=" + favorites[y].id);
  $('.meta').html('<p>track: ' + favorites[y].name +'<br>artist: ' + (favorites[y].artist || "untagged")+ '<br>album: ' + (favorites[y].id || "untagged")+ '<br>date: ' +favorites[y].date + '</p>')
  if (playPause == 0){
    playPaus()
  } else {
    var player = document.getElementById('player')
    player.play()
  }
  updatePlaylist()
})
//detect ua and modify css
$(document).ready(function(){
  ua = window.navigator.userAgent
  var re1 = /Safari/i
  var re2 = /iPhone/i
  var re9 = /iPad/i
  var re5 = /Chrome/i
  var re6 = /Firefox/i
  var re8 = /Android/i
  if (re1.test(ua) == true && re6.test(ua) == false && re5.test(ua) == false) {
    safari = true
  }
  if (re2.test(ua) == true){
    iphone = true
  }
  if (re9.test(ua) == true){
    ipad = true
  }
  if (re8.test(ua) == true) {
    android = true
  }
  if (iphone == true || ipad == true) {
    $('#volUp').remove();
    $('#volDown').remove();

  }
  if (iphone == true || android == true){
    $('ul').css("width", "400px")
    $('#inputField').css("width", "376px")
  }
//initialize favorites list
  for (var i = 0; i< favorites.length; i++){
    $('#fav').append("<li class='f' id="+i+"><button class='remove'>remove</button><button class='add'>add to up next</button>" +(favorites[i].artist || "untagged") + " - " + favorites[i].name + "</li>")
  };
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  //set button functionality
  $('#plyPaus').on('click', function(){
    playPaus()
  })
  $('.playAll').on("click", function(){
    for (var m = 0; m <favorites.length; m++){
    var x = c + m + 1
    filenames.splice(x, 0, favorites[m]);
    }
    $('#next').click()
  })
  $('.shuffleAll').on("click", function(){
    var next = [];
    for (var m = 0; m <favorites.length; m++){
    next.push(favorites[m]);
    }
    next.sort(function(a, b){
      a = Math.random();
  		b = Math.random();
  		return a-b
    })
    for (var dd = 0; dd <next.length; dd++){
    filenames.splice(c+1 + dd, 0, next[dd]);
    }
    updatePlaylist()
    $('#next').click()
  })
})
//get files and metadata
function doTheThing(){
  var e = filenames.length - c;
  var random = Math.floor(Math.random() * ids.length)
  play.push(ids[random]);
  updatePlaylist()
  if (e < 25) {
  $.get("https://archive.org/metadata/"+ play[play.length-1]["identifier"], function(data){
  })
  .then(function(data){
    if (iphone == false && safari == false || ipad == false){
    var files = data.files.filter(function(el, ind, arr){
      var re = /MP3/
      var re4 = /zip/i
      return el["format"] === "VBR MP3" || el["format"] === "Ogg Vorbis" || (re.test(el["format"]) && re4.test(el["format"] == false))
    })}
    else {
      var files = data.files.filter(function(el, ind, arr){
        var re = /MP3/
        var re4 = /zip/i
        return el["format"] === "VBR MP3" || (re.test(el["format"]) && re4.test(el["format"] == false))
      })
    }
    var images = data.files.filter(function(el, ind, arr){
      return el["format"] === "JPEG"
    })
    var o = images.length
    var imageNum = Math.floor(Math.random() * o)
  // (files[number]["name"])
  if (o > 0){
    var img = images[imageNum]["name"]
  } else {
    var images2 = data.files.filter(function(el, ind, arr){
      return el["format"] === "PNG" || el["format"] === "JPEG Thumb"
    })
    var o2 = images2.length
    var imageNum2 = Math.floor(Math.random() * o2)
    if (o2 > 0) {
      var img = images2[imageNum2]["name"]
    }
  }
  // console.log(files[number])
  // console.log(play[i])
    if (!!img){
      var imageurl = "https://archive.org/download/" + data.metadata.identifier + "/" + img
    } else {
    var imageurl = "https://placehold.it/400x300"
    };
    var x = files.length
    var number = Math.floor(Math.random() * x)
  // console.log(files[number]["name"])
  if (x > 0) {
    var name = files[number]["name"];
    var url = "https://archive.org/download/" + data.metadata.identifier + "/" + name;
    var releaseurl = "https://archive.org/details/" + data.metadata.identifier;
    var license= data.metadata.licenseurl
  }
  // console.log(files[number])
  // consol
    if (!!name){
      var f = {'license': license, 'releaseurl': releaseurl, 'url': url, 'name': (files[number]["title"] || name || "untagged"), 'id': (files[number]["album"] || data.metadata.identifer || "untagged"), "artist": (files[number]["artist"] || data.metadata.creator || "untagged"), "date": data.metadata.publicdate, "img": imageurl}
      filenames.push(f);
    if ($('#player').attr("src") == ""){
      $('#player').attr("src", url)
      $('#art').attr("src", imageurl || "https://placehold.it/400x300")
      $('.download').attr("href", url)
      $('.license').attr('href', license || "please research this track before use");
      $('.release').attr("href", releaseurl || "https://archive.org/search.php?query=" + data.metadata.id)
      $('.meta').html('<p>track: ' + (files[number]["title"] || name || "untagged") +'<br>artist: ' + (files[number]["artist"] || data.metadata.creator || "untagged") + '<br>album: ' + (files[number]["album"] || data.metadata.title || "untagged") + '<br>date: ' +data.metadata.publicdate +'</p>')
    }
    //recursion to maintain upcoming tracks
    if (e < 25) {
      doTheThing()
    }
  } else {
    //get another track if no file found
    doTheThing()
  }
  })
  .catch(function(error){
    console.log(error)
  })
}
updatePlaylist();
}
//play pause functionality
function playPaus() {
  if (playPause == 0) {

    $('#player').attr("autoplay", true)
    var playa = document.getElementById('player')
    playa.play(); $('#plyPaus').html('<i class="material-icons">pause</i>'); playPause = 1;
    var player = document.getElementById('player');
    //autoplay next on track end
    player.onended = function(){
      $('#next').click();
    }
  } else {
    $('#player').attr("autoplay", false)
    document.getElementById('player').pause(); $('#plyPaus').html('<i class="material-icons">play_arrow</i>'); playPause = 0;

  }
  updatePlaylist();
}
//go to next track, set src, img, metadata, and links for current track
function doThingTwo() {
  c++;
  $('#plyPaus').text('pause')
  $('#player').attr('src',  filenames[c].url);  $('.download').attr('href', filenames[c].url);
  $('.license').attr('href', filenames[c].license || "please research this track before use");
  $('.release').attr("href", filenames[c].releaseurl || "https://archive.org/search.php?query=" + filenames[c].id)
  $('#art').attr("src", filenames[c].img || "https://placehold.it/400x300");
  $('.meta').html('<p>track: ' + filenames[c].name +'<br>artist: ' + (filenames[c].artist || "untagged")+ '<br>album: ' + (filenames[c].id || "untagged") + '<br>date: ' +filenames[c].date + '</p>')
  if (playPause == 0) {
    playPaus()
  } else {
    document.getElementById('player').play(); $('#plyPaus').html('<i class="material-icons">pause</i>'); playPause = 1;
  }
};
//move backwards in the playlist
$('#prev').on("click", function() {
  //prevent skipping to negative values
  if (c > 0) {
    added++
    //decrease current play count
    c--;
    updatePlaylist();
    //set src, meta, links, and img
    $('#player').attr('src',  filenames[c].url); document.getElementById('player').play(); $('.download').attr('href', filenames[c].url);
    $('.license').attr('href', filenames[c].license || "please research this track before use");
    $('.release').attr('href', filenames[c].releaseurl || "https://archive.org/search.php?query=" + filenames[c].id);
    $('#art').attr("src", filenames[c].img || "https://placehold.it/400x300");
    $('.meta').html('<p>track: ' + filenames[c].name +'<br>artist: ' + (filenames[c].artist || "untagged") + '<br>album: ' + (filenames[c].id || "untagged") + '<br>date: ' + filenames[c].date +'</p>')
  }
})
//update player time on seekbar click
$('#seekbar').on("click", function(e) {
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var player = document.getElementById('player');
  var z = (x/400 )* player.duration;
  player.currentTime = z;
})
//when you click the next button
$('#next').on("click", function(){
  if (added > 0) {added--}
  //get tracks
  doTheThing();
  //go to next track and update data
  doThingTwo();
  updatePlaylist();
})
$('#volDown').on("click", function(){
  document.getElementById('player').volume -= 0.1;
})
$('#volUp').on("click", function(){
  document.getElementById('player').volume += 0.1;
})
$('#like').on("click", function(){
  likeIt();
})
//css modifications for clicking hide show buttons
function setButtonAndText(){
  if (nextshow == 1){
    $("#shupnext").text("hide up next");
    $("#shupnext").css({"background": "turquoise",
  "color": "white"})
  } else {
    $("#shupnext").text("show up next")
    $("#shupnext").css({"background": "darkgray",
    "color": "black"})
  }
  if (favshow == 1){
    $("#shfav").text("hide favorites")
    $("#shfav").css({"background": "turquoise",
    "color": "white"})
  } else {
    $("#shfav").text("show favorites")
    $("#shfav").css({"background": "darkgray",
    "color": "black"})
  }
  if (chatshow == 1){
    $("#shchat").text("hide chat")
    $("#shchat").css({"background": "turquoise",
    "color": "white"})
  } else {
    $("#shchat").text("show chat")
    $("#shchat").css({"background": "darkgray",
    "color": "black"})
  }
}
var favshow = 0
var nextshow = 0
var chatshow = 0
$('#shupnext').on("click", function(){
  if (nextshow == 0){
    nextshow = 1
    favshow = 0
    chatshow = 0
    $(".player-right2").css("display", "inline-block")
    $(".player-right").css("display", "none")
    $(".player-right3").css("display", "none")
    $(".player-whole").css("width", "828px")
    $(".player-left").css("margin-left", "0")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-right2").css("height", "100%")
      $(".player-whole").css("width", "424px")
    }
  } else if (nextshow == 1){
    nextshow = 0
    favshow = 0
    chatshow = 0
    $(".player-whole").css("width", "424px")
    $(".player-right2").css("display", "none")
    $(".player-right").css("display", "none")
    $(".player-right3").css("display", "none")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-whole").css("width", "424px")
      $(".player-whole").height(607)
    }
  }
  setButtonAndText()
})

$('#shfav').on("click", function(){
  if (favshow == 0){
    nextshow = 0
    favshow = 1
    chatshow = 0
    $(".player-right").css("display", "inline-block")
    $(".player-right3").css("display", "none")
    $(".player-right2").css("display", "none")
    $(".player-whole").css("width", "828px")
    $(".player-left").css("margin-left", "0")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-right").css("height", "100%")
      $(".player-whole").css("width", "424px")
    }
  } else if (favshow == 1){
    nextshow = 0
    favshow = 0
    chatshow = 0
    $(".player-whole").css("width", "424px")
    $(".player-right2").css("display", "none")
    $(".player-right").css("display", "none")
    $(".player-right3").css("display", "none")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-whole").css("width", "424px")
      $(".player-whole").height(607)
    }
  }
  setButtonAndText()
})

$('#shchat').on("click", function(){
  if (chatshow == 0){
    nextshow = 0
    favshow = 0
    chatshow = 1
    $(".player-right3").css("display", "inline-block")
    $(".player-right").css("display", "none")
    $(".player-right2").css("display", "none")
    $(".player-whole").css("width", "828px")
    $(".player-left").css("margin-left", "0")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-right3").css("height", "100%")
      $(".player-whole").css("width", "424px")
    }
  } else if (chatshow == 1){
    nextshow = 0
    favshow = 0
    chatshow = 0
    $(".player-whole").css("width", "424px")
    $(".player-right2").css("display", "none")
    $(".player-right").css("display", "none")
    $(".player-right3").css("display", "none")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-whole").css("width", "424px")
      $(".player-whole").height(607)
    }
  }
setButtonAndText()
})
function updatePlaylist(){
  //clear the ul
  $('#upcoming').empty()
  //reset the ul
  $('#upcoming').text("up next:")
  for (var i = c + 1; i< filenames.length; i++){
    $('#upcoming').append("<li class='itemInList' id="+i+"><button class='remove2'>remove</button>" +(filenames[i].artist || "untagged")+ " - " + (filenames[i].name || "untagged") + "</li>");
  }
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  //reinitialize remove and play click handlers
  $(".remove2").on("click", function(ev){
    ev.stopImmediatePropagation();
    var y = parseInt($(this).parent().attr("id"))
    filenames.splice(y, 1)
    $(this).parent().remove();
    if (y <= added) { added--}
    doTheThing()
    updatePlaylist()
  })
  $(".itemInList").on("click", function(){
    var y = parseInt($(this).attr("id"));
    var q = y - c;
    if (q > added) {added = 0} else {added = added - q}
    c = y;
    $('#player').attr('src',  filenames[y].url);
    $('#art').attr("src", filenames[y].img || "https:placehold.it/400x300");
    $('.download').attr('href', filenames[y].url);
    $('.license').attr('href', filenames[y].license || "please research this track before use");
    $('.release').attr('href', filenames[y].releaseurl || "https://archive.org/search.php?query=" + filenames[y].id);
    $('.meta').html('<p>track: ' + filenames[y].name +'<br>artist: ' + (filenames[y].artist || "untagged") + '<br>album: ' + (filenames[y].id || "untagged") + '<br>date: ' +filenames[y].date + '</p>')
    if (playPause == 0){
      playPaus()
    } else {
      var player = document.getElementById('player')
      player.play()
    }
      doTheThing();
      updatePlaylist()
  })
  //proposed pitch shift functionality
  // $('#pitch').on("change", function(){
  //   var player = document.getElementById('player')
  //   //
  //   player.playbackRate = document.getElementById('pitch').value/100
  //   // console.log(player.playbackRate)
  //   console.log(document.getElementById('pitch').value)
  // })
}
