const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const { logger } = require("./middleware/logEvents");
const errorHandler = require("./middleware/errorHandler");
const verifyJWT = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");
const port = process.env.Port || 9000;

//----------------------------MIDDLEWARE----------------------//

//The "use" method adds middleware to all routes.
// middleware lies between the request and the respond.
// Code that runs before we handle the request and the respond.
// Does not accept RegExp.

//this is a custom middleware.(see middleware folder to see how to write -
// a function that can be use to perform some middleware logic )
app.use(logger);

// Cross Origin Resource Sharing.
app.use(cors(corsOptions));

//This handles form data (remenber that all the data input by the user-
// is transform as the query string on the url as a collection of -
// key/value pairs).
app.use(express.urlencoded({ extended: false }));

//This handle all json format data.
app.use(express.json());

//middleware for cookies.
app.use(cookieParser());

//This serves static files (css,img,js).
app.use("/", express.static(path.join(__dirname, "/public")));
app.use("/subdir", express.static(path.join(__dirname, "/public/subdir")));

//---------------------------ROUTES--------------------------------//

app.use("/", require("./routes/root"));
app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/auth"));
app.use("/logout", require("./routes/logout"));
app.use("/refresh", require("./routes/refresh"));

//all routes after the "verifyJWT" middleware will be require auth.
app.use(verifyJWT);
app.use("/subdir", require("./routes/subdir"));
app.use("/notes", require("./routes/api/notes"));

//handles the rest of the requests. "app.all" is use for routing
app.all("*", (req, res) => {
  res.status(404);
  if (req.accepts("html"))
    res.sendFile(path.join(__dirname, "views", "404.html"));
  else if (req.accepts("json")) res.json({ error: "404 Not Found" });
  else res.type("txt").send("404 Not Found");
});

app.use(errorHandler);

app.listen(port, () => console.log(`app listening on port ${port}`));
