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
for (var i = 0; i< 24; i++) {
  var random = Math.floor(Math.random() * ids.length)
  play.push(ids[random])
}
$(document).on("click", ".remove", function(ev){
  var y = parseInt($(this).parent().attr("id"))
  favorites.splice(y, 1)
  console.log(y)
  localStorage.setItem("favorites4", JSON.stringify(favorites));
  $('#fav').empty()
  $('#fav').html("click the <i class='material-icons favor'>favorite</i> button to save a track to favorites.<br>click on a track in favorites to load it into the player.<br><button class='playAll'>play all</button><br><br>favorites:")
  for (var i = 0; i< favorites.length; i++){
    $('#fav').append("<li class='f' id="+i+"><button class='remove'>Remove</button>" +(favorites[i].artist || "untagged") + " - " + favorites[i].name + "</li>")
  };
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  $('.playAll').on("click", function(){
    for (var m = 0; m <favorites.length; m++){
    filenames.splice(c+1 + m, 0, favorites[m]);
    }
    updatePlaylist()
    $('#next').click()
  })
  ev.stopPropagation();
})
for (var i = 0; i< 24; i++) {
  h = play[i]["identifier"]
  $.get("https://archive.org/metadata/"+ play[i]["identifier"], function(data){
  })
  .then(function(data){
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
    var images = data.files.filter(function(el, ind, arr){
      return el["format"] === "JPEG"
    })
    var x = files.length
    var o = images.length
    var imageNum = Math.floor(Math.random() * o)
    var number = Math.floor(Math.random() * x)
    // console.log(files[number]["name"])
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
    if (!!img){
    var imageurl = "https://archive.org/download/" + data.metadata.identifier + "/" + img}
    else {
      var imageurl = "https://placehold.it/400x300"
    };
    var url = "https://archive.org/download/" + data.metadata.identifier + "/" + name;
    if (!!name){
      filenames.push({'url': url, 'name': (files[number]["title"] || name || "untagged"), 'id': (files[number]["album"] || data.metadata.identifier || "untagged"), "artist": (files[number]["artist"] || data.metadata.creator || "untagged"), "date": data.metadata.publicdate, "img": imageurl});
      if ($('#player').attr("src") == ""){
        $('#player').attr("src", url)
        $('#art').attr("src", imageurl || "https://placehold.it/400x300")
        $('.download').attr("href", url)
        $('.meta').html('<p>track: ' + (files[number]["title"] || name || "untagged") +'<br>artist: ' + (files[number]["artist"] || data.metadata.creator || "untagged") + '<br>album: ' + (files[number]["album"] || data.metadata.title || "untagged") + '<br>date: ' +data.metadata.publicdate +'</p>')
      }
    } else {
      doTheThing()
    }
    updatePlaylist()
  })
  .catch(function(error){
    console.log(error)
  })
}
$('#player').on('timeupdate', function() {
  $('#seekbar').attr("value", this.currentTime / this.duration);
});
function likeIt(){
  favorites.push(filenames[c]);
  var id = favorites.length - 1;
  $('#fav').append("<li class='f' id="+ id+"><button class='remove'>Remove</button>" +(filenames[c].artist || "untagged") +" - "+ filenames[c].name + "</li>")
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  localStorage.setItem("favorites4", JSON.stringify(favorites))
}
$(document).on("click", ".f", function(){
  var y = $(this).attr("id")
  filenames.splice(c+1, 0, favorites[y]);
  c++;
  $('#player').attr('src',  favorites[y].url);
  $('#art').attr("src", favorites[y].img || "https:placehold.it/400x300");
  $('.download').attr('href', favorites[y].url);
  $('.meta').html('<p>track: ' + favorites[y].name +'<br>artist: ' + (favorites[y].artist || "untagged")+ '<br>album: ' + (favorites[y].id || "untagged")+ '<br>date: ' +favorites[y].date + '</p>')
  if (playPause == 0){
    playPaus()
  } else {
    var player = document.getElementById('player')
    player.play()
  }
  updatePlaylist()
})
$(document).ready(function(){
  console.log($('#player'))
  ua = window.navigator.userAgent
  console.log(ua)
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
    $('.player-left').css("margin-left", "0px")
    $('.player-left').css("-webkit-margin-left", "0px")

  }
  if (iphone == true || android == true){
    $('ul').css("width", "400px")
  }
  console.log(safari)
  console.log(iphone)
  for (var i = 0; i< favorites.length; i++){
    $('#fav').append("<li class='f' id="+i+"><button class='remove'>Remove</button>" +(favorites[i].artist || "untagged") + " - " + favorites[i].name + "</li>")
  };
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
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
})
function doTheThing(){
  var e = filenames.length - c
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
  }
  // console.log(files[number])
  // console.log(play[i])
    if (!!name){
      var f = {'url': url, 'name': (files[number]["title"] || name || "untagged"), 'id': (files[number]["album"] || data.metadata.identifer || "untagged"), "artist": (files[number]["artist"] || data.metadata.creator || "untagged"), "date": data.metadata.publicdate, "img": imageurl}
      filenames.push(f);
    if ($('#player').attr("src") == ""){
      $('#player').attr("src", url)
      $('#art').attr("src", imageurl || "https://placehold.it/400x300")
      $('.download').attr("href", url)
      $('.meta').html('<p>track: ' + (files[number]["title"] || name || "untagged") +'<br>artist: ' + (files[number]["artist"] || data.metadata.creator || "untagged") + '<br>album: ' + (files[number]["album"] || data.metadata.title || "untagged") + '<br>date: ' +data.metadata.publicdate +'</p>')
    }
    updatePlaylist();
    if (e < 25) {
      doTheThing()
    }
  } else {
    doTheThing()
  }
  })
  .catch(function(error){
    console.log(error)
  })
  var random = Math.floor(Math.random() * ids.length)
  play.push(ids[random]);
}
}
function playPaus() {
  if (playPause == 0) {

    $('#player').attr("autoplay", true)
    var playa = document.getElementById('player')
    playa.play(); $('#plyPaus').html('<i class="material-icons">pause</i>'); playPause = 1;
    var player = document.getElementById('player');
    player.onended = function(){
      $('#next').click();
    }
  } else {
    $('#player').attr("autoplay", false)
    document.getElementById('player').pause(); $('#plyPaus').html('<i class="material-icons">play_arrow</i>'); playPause = 0;

  }
  updatePlaylist();
}
function doThingTwo() {
  c++;
  $('#plyPaus').text('pause')
  $('#player').attr('src',  filenames[c].url);  $('.download').attr('href', filenames[c].url);
  $('#art').attr("src", filenames[c].img || "https://placehold.it/400x300");
  $('.meta').html('<p>track: ' + filenames[c].name +'<br>artist: ' + (filenames[c].artist || "untagged")+ '<br>album: ' + (filenames[c].id || "untagged") + '<br>date: ' +filenames[c].date + '</p>')
  if (playPause == 0) {
    playPaus()
  } else {
    document.getElementById('player').play(); $('#plyPaus').html('<i class="material-icons">pause</i>'); playPause = 1;
  }
};
$('#prev').on("click", function() {
  if (c > 0) {
    c--;
    updatePlaylist();
    $('#player').attr('src',  filenames[c].url); document.getElementById('player').play(); $('.download').attr('href', filenames[c].url);
    $('#art').attr("src", filenames[c].img || "https://placehold.it/400x300");
    $('.meta').html('<p>track: ' + filenames[c].name +'<br>artist: ' + (filenames[c].artist || "untagged") + '<br>album: ' + (filenames[c].id || "untagged") + '<br>date: ' + filenames[c].date +'</p>')
  }
})
$('#seekbar').on("click", function(e) {
  var rect = this.getBoundingClientRect();
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;
  var player = document.getElementById('player');
  var z = (x/400 )* player.duration;
  player.currentTime = z;
})
$('#next').on("click", function(){
  doTheThing();
  doThingTwo();
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
var favshow = 0
var nextshow = 0
$('#shfav').on("click", function(){

  if (favshow == 0 && nextshow == 0){
    favshow = 1
    $(".player-right").css("display", "inline-block")
    $(".player-whole").css("width", "828px")
    $(".player-left").css("margin-left", "0")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-right").css("height", "100%")
      $(".player-whole").css("width", "424px")
    }


} else if (favshow == 0 && nextshow == 1){
  favshow = 1
  nextshow = 0
  $(".player-right").css("display", "inline-block")
  $(".player-right2").css("display", "none")
  if (android == true || iphone == true) {
    $(".player-whole").css("flex-direction", "column")
    $(".player-whole").css("height", "100%")
    $(".player-right").css("height", "100%")
    $(".player-whole").css("width", "424px")
  }
}
else if (favshow == 1 && nextshow == 1){
  favshow = 0
  $(".player-right").css("display", "none")
  if (android == true || iphone == true) {
    $(".player-whole").css("width", "424px")
    $(".player-whole").height(607)
  }
} else {
  favshow = 0
  $(".player-right").css("display", "none")
  $(".player-whole").css("width", "424px")
  if (android == true || iphone == true) {
    $(".player-whole").css("width", "424px")
    $(".player-whole").height(607)
  }
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
if (nextshow == 1){
  $("#shupnext").text("hide up next");
  $("#shupnext").css({"background": "turquoise",
  "color": "white"})
} else {
  $("#shupnext").text("show up next")
  $("#shupnext").css({"background": "darkgray",
  "color": "black"})
}
})
$('#shupnext').on("click", function(){
  if (favshow == 0 && nextshow == 0){
    nextshow = 1
    $(".player-right2").css("display", "inline-block")
    $(".player-whole").css("width", "828px")
    $(".player-left").css("margin-left", "0")
    if (android == true || iphone == true) {
      $(".player-whole").css("flex-direction", "column")
      $(".player-whole").css("height", "100%")
      $(".player-right2").css("height", "100%")
      $(".player-whole").css("width", "424px")
    }


} else if (favshow == 1 && nextshow == 0){
  nextshow = 1
  favshow = 0
  $(".player-right2").css("display", "inline-block")
  $(".player-right").css("display", "none")
  if (android == true || iphone == true) {
    $(".player-whole").css("flex-direction", "column")
    $(".player-whole").css("height", "100%")
    $(".player-right2").css("height", "100%")
    $(".player-whole").css("width", "424px")
  }
}
else if (favshow == 1 && nextshow == 1){
  nextshow = 0
  $(".player-right2").css("display", "none")
  if (android == true || iphone == true) {
    $(".player-whole").css("width", "424px")
    $(".player-whole").height(607)
  }
} else {
  nextshow = 0
  $(".player-right2").css("display", "none")
  $(".player-whole").css("width", "424px")
  if (android == true || iphone == true) {
    $(".player-whole").css("width", "424px")
    $(".player-whole").height(607)
  }
}
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
})
function updatePlaylist(){
  $('#upcoming').empty()
  $('#upcoming').text("up next:")
  for (var i = c + 1; i< filenames.length; i++){
    $('#upcoming').append("<li class='itemInList' id="+i+"><button class='remove2'>Remove</button>" +(filenames[i].artist || "untagged")+ " - " + (filenames[i].name || "untagged") + "</li>");
  }
  if (iphone == true || android == true){
    $('li').css("width", "376px")
  }
  $(".remove2").on("click", function(ev){
    ev.stopImmediatePropagation();
    var y = parseInt($(this).parent().attr("id"))
    filenames.splice(y, 1)
    $(this).parent().remove();
    updatePlaylist()
  })
  $(".itemInList").on("click", function(){
    var y = parseInt($(this).attr("id"));
    var q = y - c
    c = y;
    $('#player').attr('src',  filenames[y].url);
    $('#art').attr("src", filenames[y].img || "https:placehold.it/400x300");
    $('.download').attr('href', filenames[y].url);
    $('.meta').html('<p>track: ' + filenames[y].name +'<br>artist: ' + (filenames[y].artist || "untagged") + '<br>album: ' + (filenames[y].id || "untagged") + '<br>date: ' +filenames[y].date + '</p>')
    if (playPause == 0){
      playPaus()
    } else {
      var player = document.getElementById('player')
      player.play()
    }
      doTheThing()
  })
}
