const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* function that convert Date Object to YYYY-MM-DD string */
function getFormatDate(date) {
    let year = date.getFullYear();
    let month = 1 + date.getMonth();
    month = month < 10 ? "0" + month : month;
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    return `${year}${month}${day}`;
}

/* get user */
router.get("/user/:mode", (req, res) => {
    if (req.params.mode == "all") {
        connection.query("SELECT * FROM tbltemp", (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: false });
            } else {
                res.json({ result: true, content: result });
            }
        });
    } else if (req.params.mode == "withouttemp") {
        let query = "SELECT name, nfcid, belong, id FROM tbltemp";
        connection.query(query, (err, result) => {
            if (err) {
                console.log(err);
                res.json({ result: false });
            } else {
                // console.log(result);
                res.json({ result: true, content: result });
            }
        });
    } else if (req.params.mode == "identify") {
        let nfcid = req.query.nfcid;
        if (nfcid) {
            let today = new Date();
            today = "t_" + getFormatDate(today);
            connection.query(
                `SELECT name, belong, id,${today} FROM tblTemp where nfcid=?`,
                [nfcid],
                (err, queryResult) => {
                    if (err) {
                        console.log(err);
                        res.json({ result: false });
                    } else if (queryResult.length > 0) {
                        let temperature = null;
                        if (queryResult[0][`${today}`]) {
                            temperature = queryResult[0][`${today}`];
                        }
                        res.json({ result: true, obj: queryResult[0] });
                    } else {
                        res.json({ result: false, obj: null });
                    }
                },
            );
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
        if (!Array.isArray(target)) {
            target = Array(target);
        }
        console.log("/addUser target: ", target);
        let query = "INSERT INTO tblTemp (name, nfcid, belong,id) VALUES ";
        let params = [];
        target.forEach((element) => {
            if (element["name"] != "" && element["nfcid"] != "") {
                params.push(element["name"]);
                params.push(element["nfcid"]);
                params.push(element["belong"]);
                params.push(element["id"]);
                query += "(?,?,?,?),";
            }
        });
        query = query.substring(0, query.length - 1); //delete last , character
        connection.query(query, params, (err) => {
            if (err) {
                console.log(err);
                res.json({ result: false });
            } else {
                res.json({ result: true });
            }
        });
    } else {
        res.json({ result: false });
    }
});

/*delete user */
router.delete("/user", (req, res) => {
    console.log(req.body.target);
    let query = "DELETE FROM tblTemp where ";
    let params = [];
    req.body.target = [0, ...req.body.target];
    let size = req.body.target.length;

    for (let i = 1; i < size; ++i) {
        query += " nfcid=? ";
        params.push(req.body.target[i]);
        if (i != size - 1) {
            query += " or ";
        }
    }
    connection.query(query, params, (err) => {
        if (err) {
            console.log(err);
            res.json({ result: false });
        } else {
            res.json({ result: true });
        }
    });
});

/* add temperature information */
router.get("/addTempData", (req, res) => {
    let nfcid = req.query.nfcid;
    let temperature = req.query.temperature;
    if (nfcid && temperature) {
        let now = new Date();
        now = "t_" + getFormatDate(now);
        connection.query(`UPDATE tbltemp SET ${now} = ? WHERE nfcid = ?`, [temperature, nfcid], (err) => {
            if (err) {
                console.log(err);
                res.json({ result: false });
            } else {
                res.json({ result: true });
            }
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
