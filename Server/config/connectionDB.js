const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config({ path: "config.env" });

// const connection = mysql.createConnection(process.env.BASE_URL_DB);
// connection.connect((err, connection) => {
//   if (err) {
//     console.log(err.message, connection);
//   } else {
//     console.log("Connected database! ");
//   }
// });

let connection;

function handleDisconnect() {
  connection = mysql.createConnection(process.env.BASE_URL_DB);

  connection.connect((err) => {
    if (err) {
      console.error("خطأ في الاتصال بقاعدة البيانات:", err);
      setTimeout(handleDisconnect, 5000); // إعادة المحاولة بعد 5 ثوانٍ
    } else {
      console.log("✅ تم الاتصال بقاعدة البيانات");
    }
  });
}

handleDisconnect();
module.exports = connection;


