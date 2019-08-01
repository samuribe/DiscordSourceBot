const { handleImageLinkSourcing } = require('./sourcers/tracemoe');
const { getRandDrink } = require('./sourcers/cocktail-api');
require('dotenv').config();

const Discord = require('discord.js');
const client = new Discord.Client();
const discordToken = process.env.DISCORD_TOKEN;
const sourcerOptions = {
    minSimilarity: 0.91,       // Minimum similarity between sourced image and source image
    maxAspectRatioError: 0.15, // Maximum error% between multiples of ideal (16:9 or 4:3) and true aspect ratio
    minColorfulness: 0.05,     // Minimum % of saturated pixels
    minOverhead: 0.01          // Minimum separation for (similarity of best source - similarity of second best source)
};

client.on('ready', () => {
    console.log('Prepared to source...');
});

client.on('message', async message => {
    if (message.content[0] === '$') {
        let msgStr = message.content.split(' ');
        let lastSearch = 0;
        let searchesToday = 0;
        switch(msgStr[0]) {
            // Format: $source {imageLink} OR $source {image attachment}
            case '$source':
                if (Date.now() - lastSearch < 7) {
                    message.channel.send("Please don't spam, SourceBot has a hard limit to the number of searches it can perform per minute");
                }
                else if (searchesToday > 145) {
                    message.channel.send('Unable to perform more source checks, API request limit reached')
                }
                else if (msgStr.length === 2) {
                    let source = await handleImageLinkSourcing(msgStr[1], sourcerOptions);
                    console.log('Source: ', source);
                    if (source) {
                        message.channel.send(source.responseText);
                    }
                    else {
                        message.channel.send('SourceBot was unable to source your image :(');
                    }
                    lastSearch = Date.now();
                    searchesToday++;
                }
                else if (message.attachments.array().length === 1) {
                    let imageUrl = message.attachments.first().url;
                    let source = await handleImageLinkSourcing(imageUrl, sourcerOptions);
                    if (source) {
                        message.channel.send(source.responseText);
                    }
                    else {
                        message.channel.send('SourceBot was unable to source your image :(');
                    }
                    lastSearch = Date.now();
                    searchesToday++;
                }
                else {
                    message.channel.send('Invalid Command\nFor sourcing, use the format $source {image URL} OR $source with attached image file');
                }
                break;
            case '$drink':
                let drink = await getRandDrink();
                drink = drink.drinks[0];
                //console.log(drink);
                let output = drink.strDrinkThumb + '\nName: ' + drink.strDrink + '\nIng 1: ' + drink.strIngredient1 + '\nIng 2: ' + drink.strIngredient2;
                if(drink.strIngredient3 != ''){
                    output = output + '\nIng 3: ' + drink.strIngredient3;
                }
                if(drink.strIngredient4 != ''){
                    output = output + '\nIng 4: ' + drink.strIngredient4;
                }
                if(drink.strIngredient5 != ''){
                    output = output + '\nIng 5: ' + drink.strIngredient5;
                }
                message.channel.send(output);
                break;
            case '$help':
                message.channel.send('Use the $source command to source an anime screencap!\n$source {image URL} or just $source with an attached image file');
                break;
            default:
                message.channel.send('Use $help for help using SourceBot commands')
        }
    }
});

client.login(discordToken);
