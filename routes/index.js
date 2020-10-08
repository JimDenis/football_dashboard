const express = require("express");
const router = express.Router();

var mysql = require("mysql");

var connection = require("../config/connection");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const session = require("express-session");

/*
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
*/

router.get("/", (req, res) => {
    console.log("In Root");
    res.render("root");
});

/*
router.get("/hello", (req, res, next) => {
    res.send("Hello Im out here");
});
*/

router.get("/register", (req, res) => {
    console.log("In Register");
    res.render("register");
});

router.post("/register", (req, res) => {
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
                //HashPassWord(username, password);
                InsertNewUser(username, password);
                res.redirect("/login");
            } else {
                res.render("register", {
                    message: "Invalid username or password!",
                });
            }
        }
    );

    console.log("user name = " + username);
    console.log("password = " + password);
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    console.log("In Login");

    var DBuserId = "";
    var DBuserName = "";

    let username = req.body.username;
    let password = req.body.password;

    connection.query(
        "SELECT count(*) as total FROM users WHERE username = (?)",
        [req.body.username],
        function (err, result) {
            if (err) throw err;
            console.log(result[0].total);
            if (result[0].total == 1) {
                console.log("IN IF");
                connection.query(
                    "SELECT id,username, pass FROM users WHERE username = (?)",
                    [req.body.username],
                    function (err, result) {
                        if (err) throw err;
                        console.log(result[0].id);
                        console.log(result[0].username);
                        console.log(result[0].pass);
                        console.log(password);
                        DBuserId = result[0].id;
                        DBuserName = result[0].username;
                        if (err == null) {
                            bcrypt.compare(password, result[0].pass, function (
                                error,
                                result
                            ) {
                                if (result) {
                                    console.log("YES");
                                    if (req.session) {
                                        req.session.user = {
                                            //userId: result[0].id,
                                            //username: result[0].username,
                                            userId: DBuserId,
                                            username: DBuserName,
                                        };
                                        res.redirect("/users/players");
                                    }
                                } else {
                                    res.render("login", {
                                        message:
                                            "Invalid username or password!",
                                    });
                                }
                            });
                        }
                    }
                );
            } else
                res.render("login", {
                    message: "Invalid username or password!",
                });
        }
    );
});

router.get("/logout", (req, res, next) => {
    console.log("In Login");
    if (req.session) {
        req.session.destroy((error) => {
            if (error) {
                next(error);
            } else {
                res.redirect("/");
            }
        });
    }
});

InsertNewUser = (username, password) => {
    console.log("in InsertNewUser");
    bcrypt.hash(password, SALT_ROUNDS, function (error, hash) {
        if (error == null) {
            connection.query(
                "INSERT INTO users (username, pass) VALUES (?)",
                [[username, hash]],
                function (err, result) {
                    if (err) throw err;
                    console.log("inserted");
                    //connection.end();
                }
            );
        }
    });
};

module.exports = router;
