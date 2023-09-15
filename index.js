const path = require("path");
const express = require("express");
const app = express();
const cors = require("cors");
const { logger } = require("./middleware/logEvents");
const port = process.env.Port || 9000;

//----------------------------MIDDLEWARE----------------------//

//The "use" method adds middleware to all routes.
// middleware lies between the request and the respond.
// Code that runs before we handle the request and the respond.

//this is a custom middleware.(see middleware folder to see how to write -
// a function that can be use to perform some middleware logic )
app.use(logger);

// Cross Origin Resource Sharing.
app.use(cors());

//This handles form data (remenber that all the data input by the user-
// is transform as the query string on the url as a collection of -
// key/value pairs).
app.use(express.urlencoded({ extended: false }));

//This handle all json format data.
app.use(express.json());

//This serves static files (css,img).
app.use(express.static(path.join(__dirname, "/public")));

//---------------------------ROUTES--------------------------------//

//The ^ means "star with". $ means "ends with". | means "or". (.html)? means optional.
app.get("^/$|/index(.html)?", (req, res) => {
  //res.send("hello world");
  //res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.get("/page1(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "page1.html"));
});

app.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "new-page.html"));
});

app.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

//Route handlers.
//with the third parameter "next" you can chain route handlers by just calling it. see below.
//this relates to middleware.
app.get(
  "/hello(.html)?",
  (req, res, next) => {
    console.log("attemted to load hello");
    //this will call the next callback function.
    next();
  },
  (req, res) => {
    res.send("hello world");
  }
);
//OR!!
const one = (req, res, next) => {
  console.log("one");
  next();
};
const two = (req, res, next) => {
  console.log("two");
  next();
};
const three = (req, res) => {
  console.log("three");
  res.send("chain routing handlers");
};
app.get("/chain(.html)?", [one, two, three]);

//handles the rest of the requests.
app.get("/*", (req, res) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(port, () => console.log(`app listening on port ${port}`));
