var username
var textBox = document.getElementById("inputTextBox");
var messageList = document.getElementById("messages");
var chattracks = []
function appendMessage(message) {
	var listItem = document.createElement("li");
	listItem.setAttribute("class", "chatmsg");
	var listItemText = document.createTextNode(message);
	listItem.appendChild(listItemText);
	messageList.appendChild(listItem);
	if (iphone == true || android == true){
    $('li').css("width", "376px")
    $('.chatmsg').css("width", "376px")
  }
}
function sendMessage() {
	var message = username + ": " + document.getElementById("inputTextBox").value;
	textBox.value = ""; // clear textbox
	socket.emit("chat_message", message);
	console.log("message");
}
function updateScroll(){
    var element = document.getElementById("right3");
    element.scrollTop = element.scrollHeight;
}
$('#postplay').on("click", function(){
	var ct = filenames[c];
	socket.emit("chat_message", username + " is sharing the track:")
	socket.emit("track", ct)
})
$('#send').on("click", function(){
	sendMessage()
	return false
})
socket.on("users_online", function(users){
	$('#users').text("users online: " + users)
})
socket.on("chat_message", function(message) {
  appendMessage(message); updateScroll()
});
socket.on('track', function(track){
	if (iphone == true || ipad == true){
		var re = /ogg/i
		if (re.test(track.url) == true){
			return false
		}
	}
	chattracks.push(track);
	appendTrack(track)
})
function appendTrack(track) {
	var listItem = document.createElement("li");
	listItem.setAttribute("id", chattracks.length-1)
	listItem.setAttribute("class", "chattracks chatmsg");
	var listItemText = document.createTextNode( track.artist + " - " + track.name);
	listItem.appendChild(listItemText);
	messageList.appendChild(listItem);
	if (iphone == true || android == true){
		$('li').css("width", "376px")
		$('.chatmsg').css("width", "376px")
	}
	$(document).on("click", ".chattracks", function(){
		var y = $(this).attr("id")
		filenames.splice(c+1, 0, chattracks[y]);
		c++;
		$('#player').attr('src',  chattracks[y].url);
		$('#art').attr("src", chattracks[y].img || "https:placehold.it/400x300");
		$('.download').attr('href', chattracks[y].url);
		$('.license').attr('href', chattracks[y].license || "please research this track before use");
		$('.release').attr('href', chattracks[y].releaseurl || "https://archive.org/search.php?query=" + chattracks.id);
		$('.meta').html('<p>track: ' + chattracks[y].name +'<br>artist: ' + (chattracks[y].artist || "untagged")+ '<br>album: ' + (chattracks[y].id || "untagged")+ '<br>date: ' +chattracks[y].date + '</p>')
		if (playPause == 0){
			playPaus()
		} else {
			var player = document.getElementById('player')
			player.play()
		}
		updatePlaylist()
	})
}
$('#shchat').on("click", function(){
	setTimeout(function(){
	username = username || prompt("Please enter a username for the chat:") || "anon";}, 2000)
})
