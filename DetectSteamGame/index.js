const Discord = require("discord.js");
const SteamApi = require('web-api-steam');
var fs = require("fs");
var contents = fs.readFileSync("settings.json");
var settings = JSON.parse(contents);
var alreadyPlaying = false;
var checkTimerinSec = 10;

var bot = new Discord.Client({
	autorun: true
 });
 bot.login(settings.discord.botToken);
 bot.on('ready', function (evt) {
    console.log('Connected');
	setInterval(check, checkTimerinSec*1000);
});

function check() {
	SteamApi.getPlayerInfo(settings.steam.profileID, settings.steam.apiKey, (err, data) => {
		if(err) console.log(err);
		if(data.gameid != null ){
			if(data.gameid ==  settings.steam.gameID && !alreadyPlaying ){
				alreadyPlaying = true;
				console.log("found one");
				const channel = bot.channels.get(settings.discord.channelID);
				var message = "";
				settings.discord.peopleToPing.forEach(person => {
					message += person.id + " ";
				});
				message += " " + settings.discord.message;
				channel.send(message);
			}
		}
		else{
			alreadyPlaying = false;
		}
	})
 }

 


 








