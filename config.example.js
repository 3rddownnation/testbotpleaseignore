var config = {};
config.get = function (prop, def) {
    if (!this.has(prop)) {
        if (typeof def !== "undefined") {
            return def;
        }
        return false;
    }
    return this[prop];
};
config.has = function (prop) {
    return (typeof(this[prop]) !== "undefined");
};

config.owner = "1234"; // The bot's owner, necessary for limiting . commands

// Either use email and password or token. Using a token is recommended and will be used over email and password if defined.
// config.email = "abc@example.org";
// config.password = "UTuWy1HGB2y7ASGALhwAHZ5rMr3IoyaC";
config.token = "1234";

config.set_playing = "with Discord's API";

config.enable_eval = false; // Enables the eval module, please review the code before using it since it may pose a security risk.

// Configuration used by all modules that require a database connection.
// Currently: commands, database-logger
config.database = {
    host: "127.0.0.1",
    port: 3306,
    user: "asdf",
    password: "secret",
    database: "asdf"
};

config.log_to_db = false; // Enables the database-logger module
config.log_to_file = true; // Enables the logger module

module.exports = config;