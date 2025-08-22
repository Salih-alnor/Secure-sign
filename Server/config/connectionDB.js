const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Salih1996",
    database: "securesign"
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
