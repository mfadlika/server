const expressAsyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary");
const User = require("../models/userModel.js");
const Notification = require("../models/notificationModel.js");
const { generateToken } = require("../utils.js");
const Post = require("../models/postModel.js");

exports.postSignin = expressAsyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.body.username });
  if (user) {
    if (bcrypt.compareSync(req.body.password, user.password)) {
      res.send({
        _id: user._id,
        username: user.username,
        profileName: user.profileName,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        token: generateToken(user),
      });
      return;
    }
  }
  res.status(401).send({ message: "Invalid username or password" });
});

exports.postRegister = expressAsyncHandler(async (req, res) => {
  const userCheck = await User.findOne({ username: req.body.username });
  const emailCheck = await User.findOne({ email: req.body.email });
  const forbiddenUsername = ["profile", "user", "admin"];
  if (userCheck || emailCheck) {
    if (userCheck && emailCheck) {
      return res
        .status(401)
        .send({ message: "Username and email already existed" });
    } else if (userCheck && !emailCheck) {
      return res.status(401).send({ message: "Username already existed" });
    } else {
      return res.status(401).send({ message: "Email already existed" });
    }
  } else if (forbiddenUsername.includes(req.body.username)) {
    return res.status(401).send({ message: "Username forbidden" });
  } else if (req.body.username.length < 4) {
    return res
      .status(401)
      .send({ message: "Username must be 4 characters minimum" });
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = bcrypt.hashSync(req.body.password);

  const user = await new User({
    profileName: "",
    username: username,
    email: email,
    password: password,
    picture:
      "https://res.cloudinary.com/dvzdkh44j/image/upload/v1671743643/profile/unknown.jpg",
  });
  user
    .save()
    .then(() => {
      res.send({
        _id: user._id,
        username: user.username,
        profileName: user.profileName,
        email: user.email,
        bio: user.bio,
        gender: user.gender,
        token: generateToken(user),
      });
    })
    .catch((err) => {
      res.status(404).send({ message: err });
    });
});



exports.getUserData = expressAsyncHandler(async (req, res) => {
  const userData = await User.findOne({ username: req.headers.username });
  res.send(userData);
});
