const express = require("express");
const router = express.Router();
const path = require("path");

//The ^ means "star with". $ means "ends with". | means "or". (.html)? means optional.
router.get("^/$|/index(.html)?", (req, res) => {
  //res.send("hello world");
  //res.sendFile("./views/index.html", { root: __dirname });
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

router.get("/page1(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "page1.html"));
});

router.get("/new-page(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "new-page.html"));
});

router.get("/old-page(.html)?", (req, res) => {
  res.redirect(301, "/new-page.html");
});

//Route handlers.
//with the third parameter "next" you can chain route handlers by just calling it. see below.
//this relates to middleware.
router.get(
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
router.get("/chain(.html)?", [one, two, three]);

module.exports = router;
