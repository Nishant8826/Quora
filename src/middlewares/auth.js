const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const authentication = async (req, res, next) => {
  try {
    const userToken = req.headers["x-auth-key"];
    await jwt.verify(userToken, "Project6-Quora", function (err, decode) {
      if (err) {
        return res.status(400).send({ status: false, msg: err.message });
      } else {
        res.token = decode;
        next();
      }
    });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { authentication };
