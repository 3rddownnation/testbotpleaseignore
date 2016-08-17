'use strict';

var cluster = require("cluster"),
    bot,
    moment = require("moment"),
    trigger = 0;

if (!require("fs").existsSync("./config.js")) {
    console.error("config.js does not exists.\nPlease rename config.example.json and configure it properly before retrying.");
    process.exit();
}
if (cluster.isMaster) {
    cluster.fork();
    cluster.on("exit", function (worker, code, signal) {
        if (code == 100105101) {
            console.log("Exit requested.");
            process.exit();
        }
        let ctime = moment().valueOf();
        if (ctime - trigger > 5000) {
            trigger = ctime;
            cluster.fork();
        } else {
            console.log("Repeatedly died, quitting");
            process.exit();
        }
    });
}

if (cluster.isWorker) {
    delete require.cache[require.resolve('./bot.js')];
    bot = require("./bot.js");
}