const express = require("express");
const router = express.Router();
var mysql = require("mysql");

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

router.get("/players/", (req, res) => {
    let playerId = req.session.user.username;
    console.log(playerId);

    connection.query(
        "SELECT id, player_active, player_first_name, player_last_name FROM players",
        [req.body.username],
        function (err, result) {
            if (err) throw err;
            console.log(result.length);
            console.log(result[0]);
            console.log(result[1]);
            console.log(result[2]);
            res.render("players", { playerId: playerId, result: result });
        }
    );
});

router.get("/add-players", (req, res) => {
    console.log("In get add user");
    res.render("add-player");
});

router.post("/add-players", (req, res) => {
    console.log("In post to add user");

    let PlayerActive = req.body.PlayerActive;
    let FirstName = req.body.FirstName;
    let LastName = req.body.LastName;

    console.log(PlayerActive);
    console.log(FirstName);
    console.log(LastName);

    connection.query(
        "INSERT INTO players (player_active, player_first_name, player_last_name) VALUES (?)",
        [[PlayerActive, FirstName, LastName]],
        function (err, result) {
            if (err) throw err;
            console.log("inserted");
            res.redirect("/users/players/");
            //connection.end();
        }
    );
});

router.get("/players/edit/:playerId", (req, res) => {
    let playerId = req.params.playerId;

    connection.query(
        "SELECT id, player_active, player_first_name, player_last_name FROM players WHERE id = (?)",
        [playerId],
        function (err, result) {
            if (err) throw err;
            console.log(result.length);
            console.log(result);
            res.render("edit-players", result[0]);
        }
    );
});

router.post("/edit-players", (req, res) => {
    console.log("In get edit player");

    let Id = req.body.playerId;
    let PlayerActive = req.body.PlayerActive;
    let PlayerFirstName = req.body.FirstName;
    let PlayerLastName = req.body.LastName;

    console.log(Id);

    connection.query(
        "UPDATE players SET player_active = (?), player_first_name = (?), player_last_name = (?) WHERE id = (?)",
        [PlayerActive, PlayerFirstName, PlayerLastName, Id],
        function (err, result) {
            if (err) throw err;
            console.log(result.length);
            console.log(result);
            res.redirect("/users/players/");
        }
    );
});

router.post("/delete-player", (req, res) => {
    console.log("In delete player");

    let Id = req.body.id;

    console.log(Id);

    connection.query("DELETE FROM players WHERE id = (?)", [Id], function (
        err,
        result
    ) {
        if (err) throw err;
        //console.log(result.length);
        console.log("Deleted " + Id);
        res.redirect("/users/players/");
    });
});

module.exports = router;
