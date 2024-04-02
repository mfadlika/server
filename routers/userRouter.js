const express = require("express");

const {
  postSignin,
  postRegister,
} = require("../controller/userController.js");

const userRouter = express.Router();

userRouter.post("/signin", postSignin);

userRouter.post("/register", postRegister);

module.exports = userRouter;
