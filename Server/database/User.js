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
      `SELECT * FROM users WHERE email_address =?`,
      [email_address],
      (err, result) => {
        if (err) return reject(err);
        if (result.length === 0) return resolve(null);
        resolve(result[0]);
      }
    );
  });
};

const getUserById = (id) => {
  return new Promise((resolve, reject) => {
    if (!id) {
      return reject(new Error("Missing required fields"));
    }
    database.query(`SELECT * FROM users WHERE id =?`, [id], (err, result) => {
      if (err) return reject(err);
      if (result.length === 0) return resolve(null);
      resolve(result[0]);
    });
  });
};

const getResetCode = (id, hashedPassword) => {
  return new Promise((resolve, reject) => {
    const values = [hashedPassword, id];
    database.query(
      `UPDATE users SET resetPasswordCode =?, resetPasswordCodeExpire = (NOW() + INTERVAL 1 MINUTE) WHERE id =?`,
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
      `SELECT resetPasswordCode FROM users WHERE email_address = ? AND resetPasswordCodeExpire > NOW()`,
      [email_address],
      (err, result) => {
        if (err) return reject(err);

        if (result.length === 0) {
          return resolve({
            message: "The reset code has expired or does not exist",
          });
        }

        resolve({ resetCode: result[0].resetPasswordCode });
      }
    );
  });
};

const updateUserPassword = (email_address, hashedNewPassword) => {
  return new Promise((resolve, reject) => {
    const values = [hashedNewPassword, email_address];
    database.query(
      `UPDATE users SET password =? WHERE email_address =?`,
      values,
      (err, result) => {
        if (err) return reject(err);
        resolve({
          message: "The password was successfully updated",
        });
      }
    );
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  getUserById,
  getResetCode,
  getValidResetCode,
  updateUserPassword
};
