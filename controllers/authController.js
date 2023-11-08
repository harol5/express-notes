const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fsPromises = require("fs").promises;
const path = require("path");

//simulating access to a database.
const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

//This is how you authorize a user to login into your app.
//key points:
//1 - make sure the data needed were passed on the req object.
//2 - check if the username is stored in the DB, then save it as object. if not, Unauthorize.
//3 - check the password passed in the req matches the one stored in the DB. if not, Unauthorize.
//4 - get the roles codes save on the DB. this will be use with the JWT along with the username.
//5 - generate accessToken and refreshToken, then save refreshToken into DB.
//6 - send accessToken in the res object and store refreshToken into httpOnly cookie.

//Route handler function.
const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    res.status(400).json({ message: "Username and password are required" });

  //TO-DO!! re-write this logic to use an actual DB.
  const foundUser = userDB.users.find((u) => u.username === user);
  if (!foundUser) return res.sendStatus(401); //unauthorized

  //evaluate password.
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //Get the user roles codes.
    const roles = Object.values(foundUser.roles);
    //create JWTs
    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "3600s" }
    );

    //TO-DO!! re-write this logic to use an actual DB. saving refresh token with user.
    const otherUsers = userDB.users.filter(
      (u) => u.username !== foundUser.username
    );
    const currentUser = { ...foundUser, refreshToken };
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );

    //TO-DO!! re-direct user to dashboard.
    //sending and storing properly the access and refresh token to the client.
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.json({ accessToken });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
