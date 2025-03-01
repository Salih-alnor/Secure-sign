const mysql = require("mysql");
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


const dbConfig = {
  host: process.env.HOST ||'localhost',
  user: process.env.USER ||'user',
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  ssl: {
    rejectUnauthorized: true
  }
};
function handleDisconnect() {
  connection = mysql.createConnection(dbConfig);

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


