const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const User = require("../classes/User.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));
const user = new User(connection);

/* get user router*/
router.get("/user/:mode", (req, res) => {
    if (req.params.mode == "all") {
        if (req.session.auth) {
            user.getUserAll()
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.json(err);
                });
        } else {
            res.json({ result: false, msg: "권한이 없습니다." });
        }
    } else if (req.params.mode == "withouttemp") {
        if (req.session.auth) {
            user.getUserWithoutTemp()
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => {
                    res.json(err);
                });
        } else {
            res.json({ result: false, msg: "권한이 없습니다." });
        }
    } else if (req.params.mode == "identify") {
        let nfcid = req.query.nfcid;
        if (nfcid) {
            user.identify(nfcid)
                .then((result) => {
                    console.log(result);
                    res.json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.json(err);
                });
        } else {
            res.json({ result: null });
        }
    } else {
        res.status(404);
        res.json({ result: null });
    }
});

/* add user information */
router.post("/user", (req, res) => {
    if (req.session.auth) {
        let target = req.body.target;
        if (target) {
            user.addUser(target)
                .then((result) => {
                    console.log(result);
                    res.json(result);
                })
                .catch((err) => {
                    console.log(err);
                    res.json(err);
                });
        } else {
            res.json({ result: false });
        }
    } else {
        res.json({ result: false, msg: "권한이 없습니다." });
    }
});

/*delete user */
router.delete("/user", (req, res) => {
    if (req.session.auth) {
        user.deleteUser(req.body.target)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err);
            });
    } else {
        res.json({ result: false, msg: "권한이 없습니다." });
    }
});

/* add temperature information */
router.get("/addTempData", (req, res) => {
    let nfcid = req.query.nfcid;
    let temperature = req.query.temperature;
    if (nfcid && temperature) {
        user.addTempData(nfcid, temperature)
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err);
            });
    } else {
        res.json({ result: false });
    }
});

module.exports = router;
