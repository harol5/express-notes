const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

const handleNewUser = async (req, res) => {
  //deconstruct the new user object.
  const { user, pwd } = req.body;

  //check if username or pwd are missing.
  if (!user || !pwd) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  //TO-DO!! re-write this logic to use an actual DB. - check for duplicate usernames in the DB.
  const duplicate = userDB.users.find((u) => u.username === user);
  if (duplicate)
    return res.status(409).json({ message: "username not availible" }); //conflict

  //If passed checks, crete user.
  try {
    //encrypt the password.
    const hashedPws = await bcrypt.hash(pwd, 10);
    //strore new user. all new users are initialize with "user" role.
    const newUser = {
      username: user,
      roles: {
        User: 2001,
      },
      password: hashedPws,
    };

    //TO-DO!! re-write this logic to use an actual DB. stores new user into the DB.
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(userDB.users)
    );

    //TO-DO!! Re-direct user to login page after registered successfuly.
    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
