const userModel = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("../utils/validation");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createUser = async (req, res) => {
  try {
    const data = req.body;
    if (validator.validEmail(data.email))
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    const findEmail = await userModel.findOne({ email: data.email });
    if (findEmail)
      return res
        .status(400)
        .send({ status: false, msg: "Email already Exist" });
    if (data.phone) {
      if (!validator.validPhone(data.phone))
        return res.status(400).send({ status: false, msg: "Invalid Phone" });
      const findPhone = await userModel.findOne({ phone: data.phone });
      if (findPhone)
        return res
          .status(400)
          .send({ status: false, msg: "Phone already Exist" });
    }
    if (data.password.length >= 15 && data.password.length <= 8)
      return res.status(400).send({
        status: false,
        msg: "password length must be between 8 to 15",
      });
    const genSalt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(data.password, genSalt);
    data.password = hashPassword;

    const createdata = await userModel.create(data);
    return res.status(201).send({ status: true, data: createdata });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const login = async (req, res) => {
  try {
    const data = req.body;
    if (validator.validEmail(data.email))
      return res.status(400).send({ status: false, msg: "Invalid Email" });
    const findEmail = await userModel.findOne({ email: data.email });
    if (!findEmail)
      return res.status(404).send({ status: false, msg: "Email not found" });
    const compare = await bcrypt.compare(data.password, findEmail.password);
    if (!compare)
      return res.status(404).send({ status: false, msg: "Incorrect password" });
    const jwtToken = await jwt.sign(
      {
        userId: findEmail._id.toString(),
      },
      "Project6-Quora",
      { expiresIn: "24h" }
    );
    res.setHeader("x-api-key", jwtToken);
    const result = {};
    result.userId = findEmail._id;
    result.token = jwtToken;
    return res.status(200).send({ status: true, data: result });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const getById = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    if (userId !== res.token.userId)
      return res.status(403).send({ status: false, msg: "Unauthorized" });
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser)
      return res.status(404).send({ status: false, msg: "User not found" });
    return res.status(200).send({ status: true, data: findUser });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!mongoose.isValidObjectId(userId))
      return res.status(400).send({ status: false, msg: "Invalid userId" });
    if (userId !== res.token.userId)
      return res.status(403).send({ status: false, msg: "Unauthorized" });
    const findUser = await userModel.findOne({ _id: userId });
    if (!findUser)
      return res.status(404).send({ status: false, msg: "User not found" });
    const keys = ["fname", "lname", "email", "phone"];
    const data = req.body;
    for (let val in data) {
      if (keys.includes(val) == false)
        return res.status(400).send({
          status: false,
          msg: "keys can be among these 'fname', 'lname', 'email','phone'",
        });
    }
    if (!validator.isValidBody(data))
      return res
        .status(400)
        .send({ status: false, msg: "Request body is empty" });
    const resultObj = {};
    if (data.fname) {
      resultObj.fname = data.fname;
    }
    if (data.lname) {
      resultObj.lname = data.lname;
    }
    if (data.email) {
      if (validator.validEmail(data.email))
        return res.status(400).send({ status: false, msg: "Invalid Email" });
      if (findUser.email == data.email)
        return res
          .status(400)
          .send({ status: false, msg: "Email already exist" });
      resultObj.email = data.email;
    }
    if (data.phone) {
      if (!validator.validPhone(data.phone))
        return res.status(400).send({ status: false, msg: "Invalid Phone" });
      const findPhone = await userModel.findOne({ phone: data.phone });
      if (findPhone)
        return res
          .status(400)
          .send({ status: false, msg: "Phone already Exist" });
      resultObj.phone = data.phone;
    }
    const updateDoc = await userModel.findOneAndUpdate(
      { _id: userId },
      resultObj,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updateDoc });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createUser, login, getById, updateUser };
