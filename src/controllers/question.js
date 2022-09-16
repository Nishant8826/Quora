const questionModel = require("../models/question");
const validator = require("../utils/validation");
const mongoose = require("mongoose");
const userModel = require("../models/user");

const createQuestion = async (req, res) => {
  try {
    let { description, tag, askedBy } = req.body;
    if (!validator.isValid(description))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid Description" });
    if (tag) {
      let tagData = tag.split(",");
      let dupTag = [...new Set(tagData)];
      req.body.tag = dupTag;
    }
    if (!validator.isValid(askedBy) || !mongoose.isValidObjectId(askedBy))
      return res.status(400).send({ status: false, msg: "Invalid askedBy" });
    if (askedBy != res.token.userId)
      return res.status(403).send({ status: false, msg: "Unauthorized" });
    const findUser = await userModel.findOne({ _id: askedBy });
    if (!findUser)
      return res.status(404).send({ status: false, msg: "User not found" });
    const createQue = await questionModel.create(req.body);
    return res.status(201).send({ status: true, data: createQue });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const filter = async (req, res) => {
  try {
    const data = req.query;
    data.isDeleted = false;
    if (data.tag) {
      let tagdata = data.tag.split(",");
      for (let i = 0; i < tagdata.length; i++) {
        tagdata[i] = tagdata[i].trim();
      }
      let dupTag = [...new Set(tagdata)];
      data.tag = { $all: dupTag };
    }
    if (data.description) {
      data.description = { $regex: data.description };
    }
    if (data.sort) {
      const filterData = await questionModel
        .find(data)
        .sort({ createdAt: data.sort });
      return res.status(200).send({
        status: true,
        msg: `${filterData.length} Matched Found`,
        data: filterData,
      });
    }
    const filterData = await questionModel.find(data);
    return res.status(200).send({
      status: true,
      msg: `${filterData.length} Matched Found`,
      data: filterData,
    });
  } catch (error) {}
};

const getById = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.isValidObjectId(questionId))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid QuestionId " });
    const findQuestion = await questionModel.findOne({ _id: questionId });
    if (!findQuestion)
      return res
        .status(404)
        .send({ status: false, msg: "QuestionId Not Found" });
    if (findQuestion.isDeleted==true)
      return res
        .status(404)
        .send({ status: false, msg: "Question is not present" });
    return res.status(200).send({ status: true, data: findQuestion });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const updateQ = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.isValidObjectId(questionId))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid QuestionId " });
    const findQuestion = await questionModel.findOne({
      _id: questionId,
      isDeleted: false,
    });
    if (!findQuestion)
      return res
        .status(404)
        .send({ status: false, msg: "Question Not Found" });
    const userId = findQuestion.askedBy;
    if (res.token.userId != userId)
      return res.status(403).send({ status: false, msg: "Unauthorized" });
    const data = req.body;
    if (!validator.isValidBody(data))
      return res
        .status(400)
        .send({ status: false, msg: "Request body is empty" });
    const resultObj = {};
    if (data.description) {
      if (data.description.trim().length == 0)
        return res
          .status(400)
          .send({ status: false, msg: "Description is empty" });
      resultObj.description = data.description;
    }
    if (data.tag) {
      let tagData = data.tag.split(",");
      let prevTag = findQuestion.tag;
      for (let i = 0; i < tagData.length; i++) {
        prevTag.push(tagData[i]);
      }
      prevTag = [...new Set(prevTag)];
      resultObj.tag = prevTag;
    }
    const updateQuestion = await questionModel.findOneAndUpdate(
      { _id: questionId, isDeleted: false },
      resultObj,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updateQuestion });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteQ = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.isValidObjectId(questionId))
      return res.status(400).send({ status: false, msg: "Invalid QuestionId" });
    const findQuestion = await questionModel.findOne({ _id: questionId });
    if (!findQuestion)
      return res.status(404).send({ status: false, msg: "Question not found" });
    if (findQuestion.askedBy != res.token.userId)
      return res.status(403).send({ status: false, msg: "Unauthorized" });
    if (findQuestion.isDeleted == true)
      return res
        .status(400)
        .send({ status: false, msg: "Question already deleted" });
    const deleteQuestion = await questionModel.findOneAndUpdate(
      { _id: questionId },
      { $set: { isDeleted: true ,deletedAt:new Date} },
      { new: true }
    );
    return res.status(200).send({ status: true, msg: "Successfully Deleted" });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { createQuestion, filter, getById, updateQ, deleteQ };
