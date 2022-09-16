const express = require("express");
const router = express.Router();
const question = require("../controllers/question");
const mid = require("../middlewares/auth");

router.post("/question", mid.authentication, question.createQuestion);
router.get("/questions", question.filter);
router.get("/questions/:questionId", question.getById);
router.put("/questions/:questionId", mid.authentication, question.updateQ);
router.delete("/questions/:questionId", mid.authentication, question.deleteQ);

module.exports = router;
