const jwt = require("jsonwebtoken");

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

    const roles = Object.values(foundUser.roles);
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30S" }
    );
    res.json({ accessToken });
  });
};

module.exports = { handleRefreshToken };
