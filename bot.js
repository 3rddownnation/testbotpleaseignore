'use strict';

var Discord = require("discord.js"),
    bot = new Discord.Client({autoReconnect: true, forceFetchUsers: true}),
    cfg = require("./config.js"),
    path = require("path"),
    normalizedPath = path.join(__dirname, "modules"),
    fs = require("fs");

var helpers = require("./helpers.js");

fs.readdirSync(normalizedPath).forEach(function (file) {
    //TODO: Find a way to "export" dependencies
    let mod = path.join(normalizedPath, file);
    if (!file.endsWith(".js")) {
        helpers.log.info("Module ignored: " + file);
        return;
    }
    var temp = new require(mod);
    try {
        if (!temp.init(bot, helpers)) {
            helpers.log.info("Module NOT loaded: " + file);
        } else {
            helpers.log.info("Module loaded: " + file);
        }
    } catch (err) {
        helpers.log.warn("Failed to load module: " + file);
        helpers.log.warn(err);
    }
});

if (cfg.has("owner")) {
    bot.on("message", (msg) => {
        if (msg.author.id === cfg.get("owner")) {
            switch (msg.cleanContent) {
                case ".reinit":
                    helpers.log.info("Reinit triggered");
                    process.exit();
                    break;
                case ".die":
                    process.exit(100105101);
                    break;
            }
        }
    });
}

bot.on("ready", function () {
    if (cfg.has("set_playing")) {
        bot.setStatus("active", cfg.get("set_playing"));
    }
    helpers.log.info("Successfully logged in!");
});
bot.on("disconnected", () => {
    helpers.log.warn("Disconnect!");
});

if (cfg.has("token")) {
    helpers.log.info("Logging in with token");
    bot.loginWithToken(cfg.get("token"));
} else if (cfg.has("email") && cfg.has("password")) {
    helpers.log.info("Logging in with email and password");
    bot.login(cfg.get("email"), cfg.get("password"));
} else {
    helpers.log.warn("token or email and password not defined in config. Exiting.");
    process.exit(100105101);
}