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
        user.getUserAll()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err);
            });
    } else if (req.params.mode == "withouttemp") {
        user.getUserWithoutTemp()
            .then((result) => {
                res.json(result);
            })
            .catch((err) => {
                res.json(err);
            });
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
});

/*delete user */
router.delete("/user", (req, res) => {
    user.deleteUser(req.body.target)
        .then((result) => {
            res.json(result);
        })
        .catch((err) => {
            res.json(err);
        });
});

/* add temperature information */
router.get("/addTempData", (req, res) => {
    let nfcid = req.query.nfcid;
    let temperature = req.query.temperature;
    if (nfcid && temperature) {
        user.addTempData(temperature, nfcid)
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

/* alter table add year date as column */
router.get("/addYear", (req, res) => {
    let query = `alter table tblTemp add( `;

    //set targetYear using current year
    let targetYear = new Date().getFullYear();

    //iterate month
    for (let i = 1; i <= 12; ++i) {
        let thisMonthLast = new Date(targetYear, i, 0).getDate(); //get last date of month
        let targetMonth = i < 10 ? "0" + i : i; //fill 0 to make 2 digits.

        //iterate date of month
        for (let j = 1; j <= thisMonthLast; ++j) {
            let targetDate = j < 10 ? "0" + j : j; //fill 0 to make 2 digits.
            query += `t_${targetYear}${targetMonth}${targetDate} varchar(5),`;
        }
    }
    query = query.substring(0, query.length - 1); //to delete last of query ',' character that cause issue.
    query += ")";
    connection.query(query, (err) => {
        if (err) {
            console.log(err);
            // res.render('index', { title: 'Express' });
            res.json({ result: false });
        } else {
            console.log("success");
            // res.render('index', { title: 'Express' });
            res.json({ result: true });
        }
    });
});

module.exports = router;
