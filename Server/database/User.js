const database = require("../config/connectionDB");

const createUser = (id, user_name, email_address, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const values = [id, user_name, email_address, hashedPassword];
    database.query(
      `INSERT INTO users (id, user_name, email_address, password) VALUES (?, ?, ?, ?)`,
      values,
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

const getUserByEmail = (email_address) => {
  return new Promise((resolve, reject) => {
    if (!email_address) {
      return reject(new Error("Missing required fields"));
    }

    database.query(
      `SELECT * FROM users WHERE email_address = ?`,
      [email_address],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null);
        resolve(result[0]);
      }
    );
  });
};

const getResetCode = (id, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const values = [hashedPassword, id];
    database.query(
      `UPDATE users SET passwordResetCode =?, passwordResetExpire = (NOW() + INTERVAL 1 MINUTE) WHERE id =?`,
      values,
      (err, result) => {
        if (err) return reject(err);
        resolve({
          message: "the password reset code was successfully updated",
        });
      }
    );
  });
};

const getValidResetCode = (email_address) => {
  return new Promise((resolve, reject) => {
    database.query(
      `SELECT passwordResetCode FROM users WHERE email_address = ? AND passwordResetExpire > NOW()`,
      [email_address],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return resolve({
            message: "The reset code has expired or does not exist",
          });
        }

        resolve({ resetCode: result[0].passwordResetCode });
      }
    );
  });
};

module.exports = {
  createUser,
  getUserByEmail,
  getResetCode,
  getValidResetCode,
};
