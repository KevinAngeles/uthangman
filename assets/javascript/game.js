/*
	function removeSpaces(str)
	====================================
	It will return the string without spaces
	
	Inputs:
	-------
	str: String

	Output:
	-------
	str: String
*/
function removeSpaces(str) {
	return str.replace(/\s+/g,'');
}

var audio = document.getElementById("myAudio");

var game = {
	charsGuessed: [],
	currentWord: "",
	currentAudioSource: "",
	opportunities: 15,
	allowedCharacters: /^[a-zA-Z0-9]+$/,//regex with the allowed characters
	selectedSong: {},
	songs: [{name:"Mighty Long Fall",singer:"One Ok Rock",country:"Japan",pic:"assets/images/artists/oneokrock.jpeg",bgpic:"assets/images/bgs/oneokrock_bg.jpg",musicSrc1:"assets/songs/mightylongfall.mp3",musicSrc2:"assets/songs/mightylongfall.ogg",picClass:"whiteBorder",textClass:"whiteFont"},{name:"Bring me to Life",singer:"Evanescence",country:"USA",pic:"assets/images/artists/evanescence.jpeg",bgpic:"assets/images/bgs/evanescence_bg.jpg",musicSrc1:"assets/songs/bringmetolife.mp3",musicSrc2:"assets/songs/bringmetolife.ogg",picClass:"whiteBorder",textClass:"whiteFont"},{name:"Low",singer:"floRida",country:"USA",pic:"assets/images/artists/florida.jpg",bgpic:"assets/images/bgs/florida_bg.jpg",musicSrc1:"assets/songs/low.mp3",musicSrc2:"assets/songs/low.ogg",picClass:"fireBorder",textClass:"fireFont"},{name:"Talk Dirty",singer:"Jason Derulo",country:"USA",pic:"assets/images/artists/jasonderulo.jpeg",bgpic:"assets/images/bgs/jasonderulo_bg.jpg",musicSrc1:"assets/songs/talkdirty.mp3",musicSrc2:"assets/songs/talkdirty.ogg",picClass:"whiteBorder",textClass:"whiteFont"}],
	wins: 0,
	getRandomSong: function(){
		//This will get a random song from the array of songs and set it to selectedSong
		this.selectedSong = this.songs[Math.floor(Math.random()*this.songs.length)];
	},
	initGame: function(){
		//This will reset some variables in order to begin the game
		game.charsGuessed = [];
		game.getRandomSong();
		this.setInitialCurrentWord();
	},
	setInitialCurrentWord: function(){
		var txt = "";
		//This will replace all the allowed characters of the song name with an underscore ('_') 
		//in order to create a song name that can be guessed by the user
		this.selectedSong.name.split('').forEach(function(c) {
   			if( !game.allowedCharacters.test(c) )
	   			txt=txt+c;
   			else
   				txt=txt+"_";

		});
   		this.currentWord = txt;
	}
}

/* Setting initial parameters for a new game */
game.initGame();
/* Check if browser supports mp3
	===========================
	Required when using multiple sources in Chrome, otherwise it won't work
	because there is a bug in Chrome with the source tags in html.
*/
if( audio.canPlayType('audio/mpeg;') )
	game.currentAudioSource = game.selectedSong.musicSrc1;
else
	game.currentAudioSource = game.selectedSong.musicSrc2;

document.getElementById("currentWord").innerHTML = game.currentWord;
document.getElementById("charactersGuessed").innerHTML = "[ ]";

/* Listen for a keyup event */
document.onkeyup = function(event) {
	//detect which key the user pressed
	var userKey = String.fromCharCode(event.keyCode).toLowerCase();
	//if the user only press a letter or a number
	if( game.allowedCharacters.test(userKey) )
	{
		//if the user hadn't guessed the character before (it is not in array charsGuessed)
		if( game.charsGuessed.indexOf(userKey) < 0 )
		{
			//reset currentWord
			game.currentWord="";
			//if the user discovered a new character that is part of the selectedSong name
			if( game.selectedSong.name.toLowerCase().indexOf(userKey) > -1 )
			{
				for(var i = 0; i < game.selectedSong.name.length; i++)
				{
					if( userKey === game.selectedSong.name[i].toLowerCase() || !game.allowedCharacters.test(game.selectedSong.name[i])  || game.charsGuessed.indexOf(game.selectedSong.name[i].toLowerCase()) > -1 )
					{
						game.currentWord = game.currentWord + game.selectedSong.name[i];
					}
					else
					{
						game.currentWord = game.currentWord + "_";
					}

				}
				
				console.log('new');
			}
			//otherwise wrong character
			else
			{
				for( var i = 0; i < game.selectedSong.name.length; i++ )
				{
					//if is not a number or letter
					//or character had already been guessed and it is part of the selected song name  
					if( !game.allowedCharacters.test(game.selectedSong.name[i]) || (game.charsGuessed.indexOf(game.selectedSong.name[i].toLowerCase()) > -1) )
					{
						game.currentWord = game.currentWord + game.selectedSong.name[i];
					}
					else
					{
						game.currentWord = game.currentWord + "_";
					}

				}	
				//decrease oportunities
				game.opportunities = game.opportunities - 1;
				console.log('wrong');
				//if you dont have more opportunities
				if( game.opportunities <= 0 )
				{
					game.initGame();
					//update the source in order to be used next time (object game)
					if (audio.canPlayType('audio/mpeg;'))
						game.currentAudioSource = game.selectedSong.musicSrc1;
					else
						game.currentAudioSource = game.selectedSong.musicSrc2;
					//show message
					document.getElementById("songTitle").innerHTML = "You Lost!";
					//reset opportunities
					game.opportunities=15;
					//reset wins
					game.wins = 0;
					document.getElementById("winsQty").innerHTML = game.wins;

				}
			}
			//add the new character to the array of characters already guessed
			game.charsGuessed.push(userKey);
			//if you finally guessed the complete song name
			if( removeSpaces(game.currentWord.toLowerCase()) === removeSpaces(game.selectedSong.name.toLowerCase()) )
			{
				console.log("Congratulations, you win!");
				game.wins = game.wins + 1;
				document.getElementById("winsQty").innerHTML = game.wins;
				document.getElementById("songTitle").innerHTML = game.selectedSong.name;
				//change pic (html5)
				document.getElementById("artistPic").setAttribute("src", game.selectedSong.pic);
				//change pic css (html5) border
				document.getElementById("artistPic").className = game.selectedSong.picClass;
				//change secondContainer Css (html5) border
				document.getElementById("secondContainer").className = "col-xs-8 col-sm-8 col-md-8 col-lg-8 col-xs-offset-2 col-sm-offset-2 col-md-offset-2 col-lg-offset-2 "+game.selectedSong.picClass;
				//set the current background (html5)
				document.getElementById("bg").style.backgroundImage='url("'+game.selectedSong.bgpic+'")';
				//change text css (html5)
				document.getElementById("titleContainer").className = "row "+game.selectedSong.textClass;
				document.getElementById("centralDiv").className = "col-xs-6 col-sm-6 col-md-6 col-lg-6 "+game.selectedSong.textClass;
				document.getElementById("songTitle").className = "row "+game.selectedSong.textClass;
				//stop the music if there was a song playing (html5)
				audio.src="";
				//get the current source of the song (html5)
				audio.src=game.currentAudioSource;
				//play the music (html5)
				audio.play();
				//start game
				game.initGame();
				//update the source in order to be used next time (object game)
				if (audio.canPlayType('audio/mpeg;'))
					game.currentAudioSource = game.selectedSong.musicSrc1;
				else
					game.currentAudioSource = game.selectedSong.musicSrc2;
			}
		}

		document.getElementById("currentWord").innerHTML = game.currentWord;
		document.getElementById("charactersGuessed").innerHTML = "["+game.charsGuessed.toString()+"]";
		document.getElementById("guessesRemaining").innerHTML = game.opportunities;
	}
}