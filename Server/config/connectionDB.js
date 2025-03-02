const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(process.env.DATABASE_URL);

  connection.connect((err) => {
    if (err) {
      console.error("خطأ في الاتصال بقاعدة البيانات:", err);
      setTimeout(handleDisconnect, 5000); // إعادة المحاولة بعد 5 ثوانٍ
    } else {
      console.log("✅ Connected database");
    }
  });
}

handleDisconnect();
module.exports = connection;


