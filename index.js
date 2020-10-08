const express = require("express");
const app = express();
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
//const PORT = 3000;
const PORT = process.env.PORT || 8080;
var mysql = require("mysql");

const checkAuth = require("./auth/checkAuth");

const userRoutes = require("./routes/users");
const indexRoutes = require("./routes/index");

const bcrypt = require("bcrypt");
const SALT_ROUNDS = 10;

const session = require("express-session");

const path = require("path");

var connection = require("./config/connection");

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

connection.connect(function (err) {
    //if (err) throw err;
    console.log("Connected to the MySQL database!");
});

const VIEWS_PATH = path.join(__dirname, "/views");

// configuring your view engine
app.engine("mustache", mustacheExpress(VIEWS_PATH + "/partials", ".mustache"));
app.set("views", VIEWS_PATH);
app.set("view engine", "mustache");

app.use(bodyParser.urlencoded({ extended: false }));

app.use("/css", express.static("css"));

app.use(
    session({
        secret: "mmnnsspprr",
        resave: false,
        saveUninitialized: false,
    })
);

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.auth = req.session.user == null ? false : true;
    next();
});

app.use("/", indexRoutes);
app.use("/users", checkAuth, userRoutes);

app.listen(PORT, () => {
    console.log("Server has started on port ", PORT);
});

/*
HashPassWord = (username, password) => {
    console.log("in HashPassWord");
    console.log(password);
    bcrypt.hash(password, SALT_ROUNDS, function (error, hash) {
        if (error == null) {
            console.log("hash = " + hash);
            InsertNewUser(username, hash);
        } else {
            console.log("hash error" + error);
        }
    });
};

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

SelectPassword = (username) => {
    console.log("in SelectPassword");

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
*/
