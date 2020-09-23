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
  connection.query(`SELECT * FROM tblTemp`, (err, result)=>{
    if(err){
      console.log(err);
    }else{
      console.log(result);
      res.render('index', { title: 'Express' });
    }
  })
});

module.exports = router;
