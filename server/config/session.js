const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);

const authdb = require("./database.js");

module.exports = {
	//secret: process.env.SESSION_SECRET,
	secret: "session secrets",
	resave: false,
	saveUninitialized: false,
	store: new MySQLStore(authdb),
};