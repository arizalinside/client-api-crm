const express = require("express");
const { route } = require("./ticket.router");
const router = express.Router();

const { insertUser, getUserByEmail } = require("../model/user/User.model");
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helper");

router.all("/", (req, res, next) => {
  // res.json({ message: "return form user router" })
  next();
});

// Create new user router
router.post("/", async (req, res) => {
  const { name, company, address, phone, email, password } = req.body;
  try {
    //hash password
    const hashedPass = await hashPassword(password);

    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);
    console.log(result);

    res.json({ message: "Successfully created new user", result });
  } catch (error) {
    console.log(error);
    res.json({ status: "error", message: error.message });
  }
});

// User sign in router
router.post("/login", async (req, res) => {
  // console.log(req.body);
  const { email, password } = req.body;

  // Get user with email from db
  const user = await getUserByEmail(email);

  const passFromDb = user && user.id ? user.password : null;

  if (!passFromDb) {
    return res.json({ status: "error", message: "Invalid password!" });
  } else {
    // Hash our password and compare with the db one
    const result = await comparePassword(password, passFromDb);
    if (result) {
      res.json({ status: "success", message: "Login Successfully" });
    } else {
      return res.json({ status: "error", message: "Invalid password!" });
    }
  }
});

module.exports = router;
