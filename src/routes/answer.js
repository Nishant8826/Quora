const express = require("express");
const router = express.Router();
const answer = require("../controllers/answer");
const mid = require("../middlewares/auth");

router.post("/answer", mid.authentication, answer.create);
router.get("/questions/:questionId/answers/:answerId", answer.fetch);
router.put("/answer/:answerId", mid.authentication, answer.update);
router.delete("/answer/:answerId", mid.authentication,answer.deleteQ);

module.exports = router;
