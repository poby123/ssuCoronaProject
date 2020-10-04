const express = require('express');
const mysql = require("mysql");
const session = require("express-session");
const router = express.Router();

const dbConfig = require("../config/database.js");
const sessionAuth = require("../config/session.js");

const connection = mysql.createPool(dbConfig);
router.use(session(sessionAuth));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SSU Corona Project' });
});

module.exports = router;
