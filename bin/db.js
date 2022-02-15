const {
  MySQLHOST,
  MySQLUSER,
  MySQLPASSWORD,
  MySQLDB,
  MySQLPORT,
} = require("./config");

const knex = require("knex")({
  client: "mysql2",
  connection: {
    host: MySQLHOST,
    port: MySQLPORT,
    user: MySQLUSER,
    password: MySQLPASSWORD,
    database: MySQLDB,
  },
});

module.exports = knex;
