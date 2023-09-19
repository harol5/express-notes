const bcrypt = require("bcrypt");
const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  if (!user || !pwd)
    res.status(400).json({ message: "Username and password are required" });

  const foundUser = userDB.users.find((u) => u.username === user);
  if (!foundUser) return res.sendStatus(401); //unauthorized

  //evaluate password.
  const match = await bcrypt.compare(pwd, foundUser.password);
  if (match) {
    //create JWTs
    res.json({ message: `user ${user} is logged in` });
  } else {
    res.sendStatus(401);
  }
};

module.exports = { handleLogin };
