const express = require("express");
const router = express.Router();

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

router.get("/hello", (req, res, next) => {
    res.send("Hello Im out here");
});

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

    //res.send("REGISTER");
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.post("/login", (req, res) => {
    console.log("In Login");
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
                        if (result[0].pass == password) {
                            console.log("YES");
                            if (req.session) {
                                req.session.user = {
                                    userId: result[0].id,
                                    username: result[0].username,
                                };
                            }
                            res.redirect("/users/players");
                        } else {
                            console.log("NO");
                            res.render("login", {
                                message: "Invalid username or password!",
                            });
                        }
                        //bcrypt.compare(result[0].pass, password, function (
                        //    error,
                        //    result
                        //) {
                        //    console.log(result);
                        //});
                    }
                );
            }
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
                res.redirect("/login");
            }
        });
    }
});

module.exports = router;
