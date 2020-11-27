const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const bcrypt = require("bcrypt");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");
const MyDate = require("./../classes/MyDate").MyDate;
const connection = mysql.createPool(dbConfig);
const myDate = new MyDate(connection);
router.use(session(sessionAuth));

/* GET home page. */
router.post("/signin", function (req, res) {
    if (req.body.id && req.body.password) {
        const id = req.body.id;
        const pw = req.body.password;
        connection.query("SELECT password FROM tbladmin where id=?", [id], function (err, results) {
            if (err) {
                console.log(err);
                res.json({ flag: false });
            } else if (results.length > 0) {
                bcrypt.compare(pw, results[0].password, (err, result) => {
                    if (err) {
                        console.log(err);
                        console.log("error at compare not found");
                        res.json({ flag: false });
                    } else {
                        console.log(result);
                        if (result) {
                            myDate.deletePrevDays();
                            myDate.checkToday();

                            req.session.id = id;
                            req.session.auth = true;

                            //session saving.
                            req.session.save(function () {
                                console.log("login Success!, id: ", id);
                                res.json({ flag: true });
                            });
                        } else {
                            console.log("password is wrong");
                            res.json({ flag: false });
                        }
                    }
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
