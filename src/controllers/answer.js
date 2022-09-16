const mongoose = require("mongoose");
const answerModel = require("../models/answer");
const questionModel = require("../models/question");
const userModel = require("../models/user");
const validator = require("../utils/validation");

const create = async (req, res) => {
  try {
    const { answeredBy, text, questionId } = req.body;
    if (!validator.isValid(answeredBy))
      return res
        .status(400)
        .send({ status: false, msg: "Answer Id is required" });
    if (!mongoose.isValidObjectId(answeredBy))
      return res.status(400).send({ status: false, msg: "Invalid Answere Id" });
    if (res.token.userId != answeredBy)
      return res.status(403).send({ status: false, msg: "Unathorized" });
    const findUser = await userModel.findById(answeredBy);
    if (!findUser)
      return res.status(404).send({ status: false, msg: "Answer not found" });
    if (!validator.isValid(text))
      return res.status(400).send({ status: false, msg: "text is required" });
    if (!validator.isValid(questionId))
      return res
        .status(400)
        .send({ status: false, msg: "Answer Id is required" });
    if (!mongoose.isValidObjectId(questionId))
      return res
        .status(400)
        .send({ status: false, msg: "Invalid QuestionId " });
    const findQuestion = await questionModel.findById(questionId);
    if (!findQuestion)
      return res
        .status(404)
        .send({ status: false, msg: "QuestionId not found" });
    const createAns = await answerModel.create(req.body);
    return res.status(201).send({ status: true, data: createAns });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const fetch = async (req, res) => {
  try {
    const questionId = req.params.questionId;
    if (!mongoose.isValidObjectId(questionId))
      return res.status(400).send({ status: false, msg: `Invalid QuestionId` });
    const findQuestion = await questionModel.findById(questionId);
    if (!findQuestion)
      return res
        .status(404)
        .send({ status: false, msg: `QuestionId not found` });
    const answerId = req.params.answerId;
    if (!mongoose.isValidObjectId(answerId))
      return res.status(400).send({ status: false, msg: `Invalid AnswerId` });
    const findAnswer = await answerModel.findById(answerId);
    if (!findAnswer)
      return res.status(404).send({ status: false, msg: `AnswerId not found` });
    const findObject = {};
    findObject._id = answerId;
    findObject.questionId = questionId;
    const findAllAnswer = await answerModel.find(findObject);
    return res.status(200).send({ status: true, data: findAllAnswer });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const update = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    if (!mongoose.isValidObjectId(answerId))
      return res.status(400).send({ status: false, msg: `Invalid AnswerId` });
    const findAnswer = await answerModel.findById(answerId);
    if (!findAnswer)
      return res.status(404).send({ status: false, msg: `AnswerId not found` });
    if (findAnswer.isDeleted == true)
      return res.status(404).send({ status: false, msg: `Answer removed` });
    if (res.token.userId != findAnswer.answeredBy.toString())
      return res.status(403).send({ status: false, msg: `Unathorized` });
    const { text, ...rest } = req.body;
    if (!validator.isValid(text))
      return res.status(400).send({ status: false, msg: `text is invalid` });
    if (Object.keys(rest).length >= 1)
      return res.status(400).send({
        status: false,
        msg: `${Object.keys(rest)} => Invalid attribute`,
      });
    const findObject = {};
    findObject.text = text;
    findObject.answeredBy = findAnswer.answeredBy;
    findObject.isDeleted = false;
    findObject.updatedAt = new Date();
    const updateDoc = await answerModel.findOneAndUpdate(
      { _id: answerId },
      findObject,
      { new: true }
    );
    return res.status(200).send({ status: true, data: updateDoc });
  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

const deleteQ = async (req, res) => {
  try {
    const answerId = req.params.answerId;
    if (!mongoose.isValidObjectId(answerId))
      return res.status(400).send({ status: false, msg: `Invalid AnswerId` });
    const findAnswer = await answerModel.findById(answerId);
    if (!findAnswer)
      return res.status(404).send({ status: false, msg: `AnswerId not found` });
    if (findAnswer.isDeleted == true)
      return res.status(404).send({ status: false, msg: `Answer removed` });
    if (res.token.userId != findAnswer.answeredBy.toString())
      return res.status(403).send({ status: false, msg: `Unathorized` });
    const deleteDoc=await answerModel.findOneAndUpdate({_id:answerId},{isDeleted:true})
    return res.status(200).send({ status: true, msg: `Successfully deleted`});

  } catch (error) {
    return res.status(500).send({ status: false, msg: error.message });
  }
};

module.exports = { create, fetch, update, deleteQ };
