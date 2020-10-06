const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const PORT = 3000;
var mysql = require("mysql");

// connect to MySQL DB
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "footballpooldb",
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected to the MySQL database!");
    // THIS IS A TEST INSERT !!!!!!
    //var sql =
    //    "INSERT INTO users (username, pass) VALUES ('JimDenis2', 'JimDenis01')";
    //connection.query(sql, function (err, result) {
    //    if (err) throw err;
    //    console.log("1 record inserted");
    //});
});

// configuring your view engine
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/register", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    //var sql =
    //    "SELECT count(*) as total FROM users WHERE username = 'JimDenis2'";
    connection.query(
        "SELECT count(*) as total FROM users WHERE username = (?)",
        [req.body.username],
        function (err, result) {
            if (err) throw err;
            console.log(result[0].total);
            let countTotal = result[0].total;
            if (result[0].total < 1) {
                InsertNewUser(username, password);
            }
            //return countTotal;
        }
    );

    //let countTotal = 0;
    //let countTotal = result[0].total;
    //console.log("total count = " + countTotal);
    //if (countTotal < 1) {
    //var sql = "INSERT INTO users (username, pass) VALUES (?)",
    //    [username, password];

    //connection.query(sql, function (err, result) {
    //    connection.query(
    //        "INSERT INTO users (username, pass) VALUES (?)",
    //        [[req.body.username, req.body.password]],
    //        function (err, result) {
    //            if (err) throw err;
    //            console.log("inserted");
    //        }
    //    );
    //}

    console.log("user name = " + username);
    console.log("password = " + password);

    //res.send("REGISTER");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(PORT, () => {
    console.log("Server has started on port ", PORT);
});

InsertNewUser = (username, password) => {
    //connection.query(sql, function (err, result) {
    connection.query(
        "INSERT INTO users (username, pass) VALUES (?)",
        [[username, password]],
        function (err, result) {
            if (err) throw err;
            console.log("inserted");
        }
    );
};
