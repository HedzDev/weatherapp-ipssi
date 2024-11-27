const bcrypt = require("bcrypt");
const User = require("../models/users");
const { checkBody } = require("../modules/utils");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { name, email, password } = req.body;
  const emailRegexValidation = /^\S+@\S+\.\S+$/;
  const passwordRegexValidation =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!checkBody(req.body, ["name", "email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }

  if (!emailRegexValidation.test(email)) {
    return res
      .status(400)
      .json({ result: false, error: "Please enter a valid email." });
  }

  if (!passwordRegexValidation.test(password)) {
    return res.status(500).json({
      result: false,
      error:
        "Please enter Minimum 8 characters, at least 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character.",
    });
  }

  const isUserExists = await User.findOne({ email });

  const hashedPassword = await bcrypt.hash(password, 10);

  if (isUserExists === null) {
    const newUser = new User({
      name: name.trim(),
      email,
      password: hashedPassword,
    });

    const savedUserData = await newUser.save();

    const token = jwt.sign(
      {
        id: savedUserData.id,
        role: savedUserData.role,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true, // Cookie cannot be accessed by client side
      secure: process.env.NODE_ENV === "production", // Cookie can only be sent over https
      sameSite: "strict", // Cookie can only be sent to the same site
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ result: true, message: "User created successfully." });
  } else {
    res.status(400).json({ result: false, error: "Email already exists." });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!checkBody(req.body, ["email", "password"])) {
    return res
      .status(400)
      .json({ result: false, error: "Missing or empty fields." });
  }

  const isUserFound = await User.findOne({ email });

  if (isUserFound && (await bcrypt.compare(password, isUserFound.password))) {
    const token = jwt.sign(
      {
        id: isUserFound.id,
        role: isUserFound.role,
      },
      JWT_SECRET,
      {
        expiresIn: "24h",
      }
    );

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ result: true, message: "User connected" });
  } else {
    res.status(404).json({ result: false, error: "Bad Credentials" });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
};
