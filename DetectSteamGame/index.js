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
	setInterval(check, checkTimerinSec * 1000);
});

bot.on('message', message => {
	if(message.channel.id == settings.discord.channelID){
		if(message.content.startsWith('!')){
			if(message.content.endsWith('register')){
				let userId = message.author.id;
				
				let containsId = false;
				settings.discord.peopleToPing.forEach(person => {
					if(person.id == userId){
						containsId = true;
					}
				});

				if(!containsId){
					settings.discord.peopleToPing.push({id: userId});
					fs.writeFile('settings.json', JSON.stringify(settings, null, '\t'), function(error){
						if(error){
							console.log("Error saving file " + error.message);
						}
					})
				}
			}
		}
	}
});

async function asyncForEach(array, callback) {
	for (let index = 0; index < array.length; index++) {
	  await callback(array[index], index, array);
	}
  }

function check() {
	SteamApi.getPlayerInfo(settings.steam.profileID, settings.steam.apiKey, (err, data) => {
		if (err) console.log(err);
		if (data.gameid != null) {
			if (data.gameid == settings.steam.gameID && !alreadyPlaying) {
				alreadyPlaying = true;
				console.log("found one");
				const channel = bot.channels.get(settings.discord.channelID);
				var message = "";
				settings.discord.peopleToPing.forEach(person => {
					message += person.id + " ";
				});
				message += " " + settings.discord.message;
				channel.send(message).then(async sendMessage => {
					var reaction = settings.discord.reactions[Math.floor(Math.random() * settings.discord.reactions.length)];
					await asyncForEach(reaction, async (r) => {
						await sendMessage.react(r);
					})
				})
				.catch(console.error);;
			}
		}
		else {
			alreadyPlaying = false;
		}
	})
}













