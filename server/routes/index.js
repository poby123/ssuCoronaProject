const express = require("express");
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();
const xml2js = require("xml2js");
const MyDate = require("../classes/MyDate").MyDate;

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");
const request = require("request");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* GET home page. */
router.get("/", function (req, res) {
    if (req.session.auth) {
        let myDate = new MyDate(connection);
        const today = new Date();
        let prev7Days = new Date().setDate(today.getDate() - 8);
        prev7Days = new Date(prev7Days);
        var url = "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson";
        const serviceKey =
            "QMfsCHlFlQAEeOStt7Bz8%2FbfiiVq7KRbTWmyDqZLVQ69QQtDKkTbWWGwG8L5zgyQY3wYoV5tOWzFs3wRJCDaNA%3D%3D";
        let queryParams = "?" + encodeURIComponent("ServiceKey") + "=" + serviceKey;
        queryParams += "&" + encodeURIComponent("pageNo") + "=" + encodeURIComponent("1");
        queryParams += "&" + encodeURIComponent("numOfRows") + "=" + encodeURIComponent("10");
        queryParams +=
            "&" + encodeURIComponent("startCreateDt") + "=" + encodeURIComponent(myDate.getFormatDate(prev7Days));
        queryParams += "&" + encodeURIComponent("endCreateDt") + "=" + encodeURIComponent(myDate.getFormatDate(today));
        url += queryParams;
        let parser = new xml2js.Parser();
        request({ url }, (err, reqRes, body) => {
            if (err) {
                console.log("err  :", err);
            } else if (reqRes) {
                parser.parseString(body, (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        // console.log(result.response.body[0].items[0].item);
                        let target = result.response.body[0].items[0].item;
                        target.reverse();
                        // console.log(target);
                        res.render("index", {
                            title: "SSU Corona Project",
                            coronaData: target,
                        });
                    }
                });
                // console.log(body);
            }
        });
    } else {
        res.render("login", { title: "SSU Corona Project" });
    }
});

module.exports = router;
