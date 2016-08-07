//display msg html 'Press any key to get started'
//below, display wins
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

var game = {
	charsGuessed: [],
	hasStarted: false,
	opportunities:15,
	allowedCharacters: /^[a-zA-Z0-9]+$/,
	selectedSong: {},
	songs: [{name:'Mighty Long Fall',singer:'One Ok Rock'},{name:'Low',singer:'floRida'},{name:'Talk Dirty',singer:'Jason Derulo'}],
	wins: 0,
	getRandomSong: function(){
		this.selectedSong = this.songs[Math.floor(Math.random()*this.songs.length)];
	},
	initGame: function(){
		game.getRandomSong();
		game.hasStarted = true;
		game.charsGuessed = [];
		game.opportunities = 15;
	},
}

document.onkeyup = function(event) {
	//detect which key the user pressed
	var userKey = String.fromCharCode(event.keyCode).toLowerCase();
	//if the user only press a letter or a number
	if( game.allowedCharacters.test(userKey) )
	{
		var currentWorld = "";
		//if is a new game
		if( !game.hasStarted )
		{
			//select a random object song from the list
			game.initGame();
		}

		//if user had already guessed the character
		if( game.charsGuessed.indexOf(userKey) > -1 )
		{
			//do nothing
			console.log('had already guessed');
		}
		//if the user hadn't guessed the character before (it is not in charsGuessed)
		else
		{
			//if the user discovered a new character that is part of the selectedSong name
			if( game.selectedSong.name.toLowerCase().indexOf(userKey) > -1 )
			{
				for(var i = 0; i < game.selectedSong.name.length; i++)
				{
					if( userKey === game.selectedSong.name[i].toLowerCase() || game.selectedSong.name[i] === ' ' || game.charsGuessed.indexOf(game.selectedSong.name[i].toLowerCase()) > -1 )
					{
						currentWorld = currentWorld+game.selectedSong.name[i];
					}
					else
					{
						currentWorld = currentWorld+"_";
					}

					if( i < (game.selectedSong.name.length - 1) )
						currentWorld = currentWorld + " ";
				}
				
				console.log('new');
			}
			//otherwise wrong character
			else
			{
				for( var i = 0; i < game.selectedSong.name.length; i++ )
				{
					//if empty character
					//or character had already been guessed and it is part of the selected song name  
					if( (game.selectedSong.name[i] === ' ') || (game.charsGuessed.indexOf(game.selectedSong.name[i].toLowerCase()) > -1) )
					{
						currentWorld = currentWorld + game.selectedSong.name[i];
					}
					else
					{
						currentWorld = currentWorld + "_";
					}

					if( i < (game.selectedSong.name.length - 1) )
						currentWorld = currentWorld + " ";
				}	
				//decrease oportunities
				game.opportunities = game.opportunities - 1;
				console.log('wrong');
				//if you dont have more opportunities
				if( game.opportunities <= 0 )
				{
					console.log("You Lost!");
					console.log("The song was " + game.selectedSong.name);
					//change the state of the game
					game.hasStarted = false;
				}
			}
			game.charsGuessed.push(userKey);
			//if you finally guessed the complete song name
			if( removeSpaces(currentWorld.toLowerCase()) === removeSpaces(game.selectedSong.name.toLowerCase()) )
			{
				console.log("Congratulations, you win!");
				game.win = game.win + 1;
				//change the state of the game
				game.hasStarted = false;
			}
		}

		console.log(currentWorld);
		console.log("Letters Already Guessed " + game.charsGuessed.toString());
		console.log("Number of Guesses Remaining " + game.opportunities);
		console.log(game);
	}
}