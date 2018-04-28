'use strict';
let knex = require('../knex');
let util = require('util');
let exec = util.promisify(require('child_process').exec);

module.exports = function(file){
    return exec(`psql -U dev -f ${file}  postgres://postgres:@localhost/noteful-test`);
};


// //return exec(`psql -f ${file} -d ${knex.client.connectionSettings.database}`);
// return exec(`psql -f ${file} -d postgres://dev:dev@localhost/noteful-test`);






