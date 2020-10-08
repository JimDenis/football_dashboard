// Set up MySQL connection.
var mysql = require("mysql");
var connection;

// connect to MySQL DB
if (process.env.JAWSDB_URL) {
    connection = mysql.createConnection(process.env.JAWSDB_URL);
} else {
    connection = mysql.createConnection({
        host: "localhost",

        // Your port; if not 3306
        port: 3306,

        // Your username
        user: "root",

        // Your password
        password: "",
        database: "footballpooldb",
    });
}

module.exports = connection;
