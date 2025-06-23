const express = require("express");
const path = require("path");
const app = express();
require("dotenv").config();
app.set("view engine", "ejs");
app.set("views", "views");
const db = require("./config/db");
const session = require("express-session");
const flash = require("connect-flash");

// static folder
app.use(express.static(path.join(__dirname, "public")));

// handlimg form data
app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

// session
app.use(
    session({
        secret: "MyS34$2!cat",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
        // 💥 Issue:
        // The secure: true option tells Express that cookies should only be sent over HTTPS . If you're testing on localhost (HTTP) , the browser won't send or store the session cookie — meaning flash messages won’t persist across redirects.
    })
);
// flash
app.use(flash());

//
app.use((req, res, next) => {
    res.locals.success_message = req.flash("success");
    res.locals.error_message = req.flash("error");
    next();
});

// ejs routes
app.use(require("./router/user.routes"));

const PORT = process?.env?.PORT;
app.listen(PORT, async () => {
    console.log(`server is running on http://127.0.0.1:${PORT}`);
    await db.dbConnection();
});
