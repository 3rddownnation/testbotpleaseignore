'use strict';

var sanitize = require("sanitize-filename"),
    winston = require("winston"),
    moment = require("moment"),
    cfg = require("./config.js"),
    Sequelize = require("sequelize");


exports.random_string = function (len) {
    //Thanks to amichair and doubletap on StackOverflow!
    let s = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return new Array(len).join().split(',').map(function () {
        return s.charAt(Math.floor(Math.random() * s.length));
    }).join('');
};

exports.sanitize = function (string) {
    return sanitize(string, {replacement: "_"});
};

exports.log = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({
            timestamp: function () {
                return new Date().toISOString().replace("T", " ").replace(/\..+/, '');
            },
            formatter: function (options) {
                // Return string will be passed to logger.
                return options.timestamp() + ' ' + options.level.toUpperCase() + ' ' + (undefined !== options.message ? options.message : '') +
                    (options.meta && Object.keys(options.meta).length ? '\n\t' + JSON.stringify(options.meta) : '');
            }
        }),
        new (winston.transports.File)({filename: "log/" + moment().format("YYYYMMDD") + ".log"})
    ]
});

exports.format_code = function (str) {
    return "```javascript\n" + str + "```";
};

exports.get_database = function () {
    let cdb = cfg.get("database");
    return new Sequelize(cdb.database, cdb.user, cdb.password, {
        host: cdb.host,
        port: cdb.port,
        dialect: 'mariadb',
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        },
        define: {
            paranoid: true,
            underscored: true,
        },
        logging: false,
    });
};