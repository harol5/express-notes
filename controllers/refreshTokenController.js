const jwt = require("jsonwebtoken");
require("dotenv").config();

//simulating access to a database.
const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

//route handler function.
const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);

  const refreshToken = cookies.jwt;
  const foundUser = userDB.users.find((u) => u.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); //forbidden.

  //evaluate JWT.
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || foundUser.username !== decoded.username)
      return res.sendStatus(403);
    const accessToken = jwt.sign(
      { username: decoded.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30S" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
