const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* GET home page. */
router.get("/", function (req, res) {
    if (req.session.auth) {
        res.render("user", { title: "SSU Corona Project" });
    } else {
        res.redirect("/");
    }
});

router.get("/temp", (req, res) => {
    if (req.session.auth) {
        res.render("user_temp", { title: "SSU Corona Project" });
    } else {
        res.redirect("/");
    }
});

module.exports = router;
