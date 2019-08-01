const rp = require('request-promise');

async function getRandDrink(){
    return rp({
        method: 'GET',
        uri: 'https://www.thecocktaildb.com/api/json/v1/1/random.php',
        json: true
    })
}

module.exports = { getRandDrink };