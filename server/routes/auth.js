const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* GET home page. */
router.post("/signin", function (req, res) {
    if (req.body.id && req.body.password) {
        const id = req.body.id;
        const pw = req.body.password;
        connection.query("SELECT * FROM tbladmin where id=? and password=?", [id, pw], function (err, results) {
            if (err) {
                console.log(err);
            }
            //when auth is 0, forbid login.
            else if (results.length == 1) {
                req.session.id = results[0].id;

                //auth saving.
                req.session.auth = true;

                //session saving.
                req.session.save(function () {
                    console.log("login Success!, id: ", results[0].id);
                    res.json({ flag: true });
                });
            } else {
                console.log("not found");
                res.json({ flag: false });
            }
        });
    } else {
        res.json({ flag: false });
    }
});

router.get("/signout", (req, res) => {
    if (req.session.auth) {
        req.session.destroy((err) => {
            if (err) {
                console.log(err);
                res.redirect("/");
            } else {
                req.session;
                console.log("signout success");
                res.redirect("/");
            }
        });
    } else {
        res.redirect("/");
    }
});
module.exports = router;
