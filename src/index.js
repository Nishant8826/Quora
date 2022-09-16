const express = require("express");
const mongoose = require("mongoose");

const user = require("../src/routes/user");
const question = require("../src/routes/question");
const answer=require("../src/routes/answer")

const app = express();
app.use(express.json());

mongoose
  .connect(
    "mongodb+srv://Nishant-R:cMVSc6ePV6V4dr03@cluster0.rembes2.mongodb.net/Project6-Quora"
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));

app.use("/", user);
app.use("/", question);
app.use("/", answer);

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Server is running on " + PORT);
});
