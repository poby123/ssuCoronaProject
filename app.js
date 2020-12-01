var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var helmet = require("helmet");
var cors = require("cors");

var indexRouter = require("./server/routes/index");
var userRouter = require("./server/routes/user");
var restRouter = require("./server/routes/rest");
var authRouter = require("./server/routes/auth");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "./server/views"));
app.set("view engine", "ejs");

app.use(
    helmet.contentSecurityPolicy({
        directives: {
            "default-src": ["'self'"],
            "connect-src": [
                "'self'",
                "https://ka-f.fontawesome.com/releases/v5.15.1/css/free-v4-font-face.min.css 'unsafe-inline'",
                "https://ka-f.fontawesome.com/releases/v5.15.1/css/free.min.css 'unsafe-inline'",
                "https://ka-f.fontawesome.com/releases/v5.15.1/css/free-v4-shims.min.css 'unsafe-inline'",
                "http://openapi.data.go.kr/openapi/service/rest/Covid19/getCovid19InfStateJson",
            ],
            "script-src": [
                "'self' 'unsafe-inline'",
                "https://code.jquery.com/jquery-3.5.1.min.js",
                "https://kit.fontawesome.com/02656a2617.js",
            ],
            "font-src": [
                "https://ka-f.fontawesome.com/releases/v5.15.1/css/ 'unsafe-inline'",
                "https://fonts.gstatic.com/ 'unsafe-inline'",
                "https://ka-f.fontawesome.com/releases/v5.15.1/webfonts/ 'unsafe-inline'",
            ],
            "style-src": ["'self' 'unsafe-inline'"],
            "style-src-elem": ["'self'", "https://fonts.googleapis.com/ 'unsafe-inline'"],
        },
    }),
);
app.use(cors({ origin: "http://openapi.data.go.kr", credentials: true }));
// app.use(cors());
app.disable("x-powered-by");
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/user", userRouter);
app.use("/rest", restRouter);
app.use("/auth", authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render("error");
});

module.exports = app;
