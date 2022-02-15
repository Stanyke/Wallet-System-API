const dotenv = require("dotenv");

dotenv.config();

const {
  PORT,
  DB_URI,
  MySQLHOST,
  MySQLUSER,
  MySQLPASSWORD,
  MySQLDB,
  MySQLPORT,
} = process.env;

module.exports = {
  localPort: PORT,
  MySQLHOST: MySQLHOST,
  MySQLUSER: MySQLUSER,
  MySQLPASSWORD: MySQLPASSWORD,
  MySQLDB: MySQLDB,
  MySQLPORT: MySQLPORT,
};
