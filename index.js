const TelegramBot = require('node-telegram-bot-api');

const token = '<TELEGRAM_BOT_TOKEN';

const bot = new TelegramBot(token, {polling: true});


const type = "Bearer <TWITCH_ACCESS_TOKEN>";

const client_id = "<TWITCH_APPLICATION_CLIENT_ID>";


var foll = new Map();

let request = require('request');

// callback is a funtion that is made for the /check command. It handles a body, only if it has the correct statusCode and isn't an error.

function callback(error, response, body) {
    if (!error && response.statusCode === 200) {
        const mes = JSON.parse(body);
        if (mes.data.length > 0) {
            for (let s=0; s < mes.data.length; s++) {
        bot.sendMessage(msg.chat.id, mes.data[s].user_name + " is currently live!\nhttps://www.twitch.tv/"+mes.data[s].user_login);
            }
        }
    }
}

//notifi function takes each separate chat_id and sends a notification if a stream is live

function notifi(arra, id, map) {

    var u = "https://api.twitch.tv/helix/streams?";
    for (let s=0; arra.length > s; s++){
        var us = arra[s];
        u += "user_login=" + us[0].toString().toLowerCase() + "&";
    }
    const options = {
        url: u,
        headers: {
            'Authorization': type,
            'Client-Id': client_id
        }
    };
    request(options, function (er, re, body) {
        if (!er && re.statusCode === 200) {

            const mes = JSON.parse(body);
            var g2 = [];
            for (let u=0; u < mes.data.length; u++) {
                g2[u] = mes.data[u].user_name
            }
            for (let s=0; arra.length > s; s++) {
                var us = arra[s]
                var i = g2.indexOf(us[0])
                if (i === -1 && us[1] === true) {
                    arra[s][1] = false;
                }
                else if (i === -1 && us[1] === 0) {
                    arra[s][1] = false;
                }
                else if (i !== -1 && us[1] === false) {
                    arra[s][1] = true;
                    bot.sendMessage(id, us[0] + " is currently live!\nhttps://twitch.tv/" + us[0]);
                }
                else if (us[1] === 0 && i !== -1) {
                    arra[s][1] = true;
                    bot.sendMessage(id, us[0] + " is currently live!\nhttps://twitch.tv/" + us[0]);
                }
            }
            }
        else {
            console.log("this failed");
        }
    });
    foll.set(id, arra);
}

// inte function calls the notifi function for every separate key and value.

function inte() {
    foll.forEach(notifi)
}

// setInterval that checks makes sure that the application sends requests to check if a stream is live or not

setInterval(inte, 30000);

// simple /start function

bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome to the twitch stream notification bot. \n"
     + "For further clarification on how this bot works, type /help");
})

// simple /help function

bot.onText(/\/help/, (msg) => {
    bot.sendMessage(msg.chat.id, "Just add the name of the streamer you would like to follow.\n" +
    "By typing /check, you can see if the streamers you added are live.");
    
})

// /follows outputs every stremers current live situation, if they are live or not

bot.onText(/\/follows/, (msg) => {
    var m = foll.get(msg.chat.id);
    for (let i=0; i < m.length; i++) {
        var live = "not live."
        if (m[i][1]) {
            live = "live."
        }
        bot.sendMessage(msg.chat.id, m[i][0].toString() + " is currently " + live);
        }
})

// By sending /check to the bot, you can see what streams are currently live and which are not.
// It also has a link to the streams, which are live.

bot.onText(/\/check/, (msg) => {
    var g = foll.get(msg.chat.id);
    var u = "https://api.twitch.tv/helix/streams";
    if (g.length > 0) {
        u += "?"
        for (let i=0; i < g.length; i++) {
            u += "user_login="+ g[i].toString().toLowerCase()+"&";
            }
    const options = {
        url: u,
        headers: {
            'Authorization': type,
            'Client-Id': client_id
        }
    };
    request(options, callback);
}
})



bot.on('message', (msg) => {
    var i = msg.chat.id
    var m = [];
    if (foll.has(i)) {
        var m = foll.get(i);
    }
    else {
        foll.set(i, m);
    }
    
//if the bot gets a command to add a new streamer, then it uses the following clause
    if (msg.text.toString().toLowerCase().indexOf("add ") === 0) {
        var tx = msg.text.toString().substr(4);
        var id = -1
        for (let a=0; a < m.length; a++) {
            if (m[a][0] === tx) {
                id = a
                a = m.length
            }
        }
        if (id !== -1) {
            bot.sendMessage(msg.chat.id, "The inputed streamer is already on the follow list.")
        }
        else {

            m.push([tx,0]);
            foll.set(i, m);
            bot.sendMessage(msg.chat.id, "The streamer has been added to the list.")
    }
}
//if the bot gets a command to remove a streamer, then it uses this clause
    if (msg.text.toString().toLowerCase().indexOf("rm ") === 0) {
        var tx = msg.text.toString().substr(3);
        var id = -1
        for (let a=0; a < m.length; a++) {
            if (m[a][0] === tx) {
                id = a
                a = m.length
            }
        }
        if (id !== -1) {
        m.splice(id, 1);
        foll.set(i, m);
        bot.sendMessage(msg.chat.id, msg.text.toString() + " has been removed from the list.")
        }
        else {
            bot.sendMessage(msg.chat.id, tx + " was not found on the followed list.")
        }
    }
});



bot.on("polling_error", (msg) => console.log(msg));
