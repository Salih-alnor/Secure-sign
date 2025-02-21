const sql = require('mysql');

const connection = sql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Salih1996',
    database: 'securesign'
});

connection.connect((err, connection) => {
    if (err) {
        console.log(err.message)
    } else {
        console.log("Connected database! ");
    
    }
})


module.exports = connection;