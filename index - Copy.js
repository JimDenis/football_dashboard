const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const PORT = 3000;
var mysql = require("mysql");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

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
});

// configuring your view engine
app.engine("mustache", mustacheExpress());
app.set("views", "./views");
app.set("view engine", "mustache");

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    connection.query(
        "SELECT count(*) as total FROM users WHERE username = (?)",
        [req.body.username],
        function (err, result) {
            if (err) throw err;
            console.log(result[0].total);
            let countTotal = result[0].total;
            if (result[0].total < 1) {
                res.render("login", {
                    message: "Invalid username or password!",
                });
            } else {
                connection.query(
                    "SELECT pass FROM users WHERE username = (?)",
                    [username],
                    function (err, result) {
                        if (err) throw err;
                        console.log("selected = " + result[0].pass);
                    }
                );
                console.log(result[0].pass);
                bcrypt.compare(result[0].pass, password, function (
                    error,
                    result
                ) {
                    console.log("result =  " + result);
                    res.render("login", {
                        message: "Invalid username or password!",
                    });
                });
                //return (result = await Promise.resolve);
                //if (!result) {
                //    res.send("SUCCESS");
                //} else {
                //    res.render("login", {
                //        message: "Invalid username or password!",
                //    });
                // }
                //let passFromDB = await SelectPassword(username);
                //console.log("hash password = " + passFromDB);
                //console.log("result in login = " + result);
            }
        }
    );
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", (req, res) => {
    console.log("In Post");
    let username = req.body.username;
    let password = req.body.password;

    connection.query(
        "SELECT count(*) as total FROM users WHERE username = (?)",
        [req.body.username],
        function (err, result) {
            if (err) throw err;
            console.log(result[0].total);
            let countTotal = result[0].total;
            if (result[0].total < 1) {
                HashPassWord(username, password);
            } else {
                res.render("register", {
                    message: "Invalid username or password!",
                });
            }
        }
    );

    console.log("user name = " + username);
    console.log("password = " + password);

    //res.send("REGISTER");
});

app.get("/register", (req, res) => {
    console.log("In Register");
    res.render("register");
});

app.listen(PORT, () => {
    console.log("Server has started on port ", PORT);
});

HashPassWord = (username, password) => {
    console.log("in HashPassWord");
    bcrypt.hash(password, SALT_ROUNDS, function (error, hash) {
        if (error == null) {
            console.log("hash = " + hash);
            InsertNewUser(username, hash);
        } else {
            console.log("hash error" + error);
        }
    });
};

InsertNewUser = (username, hash) => {
    console.log("in InsertNewUser");
    //connection.query(sql, function (err, result) {
    connection.query(
        "INSERT INTO users (username, pass) VALUES (?)",
        [[username, hash]],
        function (err, result) {
            if (err) throw err;
            console.log("inserted");
            //connection.end();
        }
    );
};

SelectPassword = (username) => {
    console.log("in SelectPassword");
    //const hashFromDB = 22;
    //return hashFromDB;
    //connection.query(sql, function (err, result) {
    connection.query(
        "SELECT pass FROM users WHERE username = (?)",
        [username],
        function (err, result) {
            if (err) throw err;
            console.log("selected = " + result[0].pass);
            hashFromDB = result[0].pass;
            return result[0].pass;
        }
    );
};

//bcrypt.compare(hashFromDB, password, function (error, result) {
//    console.log("result =  " + result);
//    app.get("/register", (req, res) => {
//        console.log("In Register");
//        res.render("register");
//    });
//return (result = await Promise.resolve);
//if (!result) {
//    res.send("SUCCESS");
//} else {
//    res.render("login", {
//        message: "Invalid username or password!",
//    });
// }
