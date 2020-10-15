const express = require('express');
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* GET home page. */
router.get('/', function(req, res) {
    res.render('user', { title: 'SSU Corona Project' });
});

router.get('/temp', (req, res)=>{
    res.render('user_temp', { title: 'SSU Corona Project' });
});

module.exports = router;
