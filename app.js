const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] }); // Clien is Discord
const token=require("./token.js"); //to export another file that has token code
const responses = ["Hey", "Hi", "Hello", "Hey"];
const randomResponse = responses[Math.floor(Math.random() * responses.length)];

var scrim = {};
class Scrim{
    constructor(message,maxPlayers){
        this.message=message;
        this.maxPlayers=maxPlayers;
        this.players=[];
    }
    addPlayer(id){
        this.players.push(id);
        this.announcePlayerCount();
        if(this.players.length===this.maxPlayers){
            this.handleFullMatch();
        }
    }
    announcePlayerCount(){
        this.message.channel.send(`There are ${this.players.length} people in the scrim`);
    }
    handleFullMatch(){
         var teamOne = [];
         var teamTwo = [];
         var shuffledPlayers=shuffle([...this.players]);
         shuffledPlayers.forEach((player,i)=>{
             var tag = "<@" + player + ">"
             if(i % 2){
                 teamOne.push(tag);
             }
             else{
                 teamTwo.push(tag);
             }
         })
         this.message.channel.send([
             "",
             "** SCRIM TEAM **",
             `Team one : ${teamOne.join(", ")}`,
             "** VS **",
             `Team Two ${teamTwo.join(", ")}` 
         ])
    }
}
function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

client.on('message',msg=>{
   if (msg.content.includes("سواح")){
       msg.reply(randomResponse);
   }
});

client.on('message',msg=>{
    if (msg.content.startsWith("+scrim")){
        var playerSlots=4;
        var promptText = `Scrim created with ${playerSlots} slots. Add reaction to join`;
        msg.reply(promptText).then(botMsg=>{
            scrim[botMsg.id]= new Scrim(botMsg,playerSlots);
        })
    }
 });

 client.on('messageReactionAdd',async(reaction,user)=>{
     if(reaction.partial){
         //Code
         try{
             await reaction.fetch();
         }catch(error){
             console.log(error);
             return;
         }
     }
     var scrim = scrims[reaction.message.id];
     if(scrim){
         scrim.addPlayer(user.id);
     }

 })

client.login(token); //Token to login to discord
