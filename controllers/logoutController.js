const fsPromises = require("fs").promises;
const path = require("path");

const userDB = {
  users: require("../model/users.json"),
  setUsers: (data) => {
    this.users = data;
  },
};

const handleLogout = async (req, res) => {
  // !!On front-end code, also delete the accessToken!!.

  //check is cookie is on req.
  const cookies = req.cookies;
  console.log(cookies);
  if (!cookies?.jwt) return res.sendStatus(204); //no content.

  // Is refreshToken in DB?
  const refreshToken = cookies.jwt;
  const foundUser = userDB.users.find((u) => u.refreshToken === refreshToken);
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    return res.sendStatus(204);
  }

  // Delete refreshToken on the DB.
  const otherUsers = userDB.users.filter(
    (u) => u.refreshToken !== foundUser.refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };
  userDB.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(userDB.users)
  );

  // add in production flag "secure:true". only will serve in https
  res.clearCookie("jwt", { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
  res.sendStatus(204);
};

module.exports = { handleLogout };
