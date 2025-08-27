const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  });

  connection.connect((err) => {
    if (err) {
      console.error(err);
      setTimeout(handleDisconnect, 5000);
    } else {
      console.log("✅ Connected database");
    }
  });
}

handleDisconnect();
module.exports = connection;
