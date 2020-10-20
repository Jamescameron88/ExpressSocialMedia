'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 * changeColumn "UserId" on table "posts"
 *
 **/

var info = {
    "revision": 2,
    "name": "initial_migration",
    "created": "2020-04-11T18:47:40.452Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId",
                "foreignKey": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId",
                "foreignKey": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId",
                "foreignKey": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "posts",
            "UserId",
            {
                "type": Sequelize.INTEGER,
                "field": "UserId",
                "foreignKey": true
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
