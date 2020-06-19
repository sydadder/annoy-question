var express = require("express");
var router = express.Router();
var AppDAO = require("../models/jsonDb.js");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Home",
    description:
      "Home page that allows the users to navigate to the survey page or the list page",
  });
});

router.get("/challenge/:id", function (req, res, next) {
  console.log(`The challenge id is ${req.params.id}`);

  let DataRecord = AppDAO.getResult(req.params.id);

  res.render("challenge", {
    title: "Challenge",
    subtitle: "I have a question for you",
    question: DataRecord.question,
    answer1: DataRecord.correctAnswer,
    answer2: DataRecord.incorrectAnswer,
    comment: DataRecord.PostComment,
    questionAuthor: DataRecord.authorEmail,
    description: "Challenge",
  });
});

router.get("/adminsyed", function (req, res, next) {
  res.render("admin/admin", {
    title: "Admin Section",
    description: "List of all active members and questions",
  });
});

router.get("/create", function (req, res, next) {
  res.render("create", {
    title: "Create",
    description:
      "Just add a Question, answer and pass the generated link to your friends.",
  });
});

router.post("/submit", function (req, res, next) {
  //Validate entries
  console.log(req.body.valid_data);

  let PostEmail = req.body.valid_data.InputEmail1,
    PostQuestion = req.body.valid_data.InputQuestion,
    PostCorrectAnswer = req.body.valid_data.InputAnswer1,
    PostIncorrectAnswer = req.body.valid_data.InputAnswer2,
    PostComment = req.body.valid_data.FormControlTextarea1,
    filter = /^([\w-\.]+)@((\[[0-9]{1,5}\.[0-9]{1,5}\.[0-9]{1,5}\.)|(([\w-]+\.)+))([a-zA-Z]{2,5}|[0-9]{1,5})(\]?)$/;

  //Second layer for validation of entries if the browser based JS is penetrated.
  let valid = filter.test(PostEmail) ? true : false;
  //Smilarly can add additional checks for comment and selection

  if (valid) {
    // Update the local
    let identifier = Date.now();
    console.log(
      `Inserting ${PostEmail} ${PostQuestion} ${PostCorrectAnswer} ${PostIncorrectAnswer} ${PostComment}`
    );
    AppDAO.insert(
      PostEmail,
      PostQuestion,
      PostCorrectAnswer,
      PostIncorrectAnswer,
      PostComment,
      identifier
    );
    res.json({ errors: false, id: identifier });
  } else {
    res.json({ errors: true });
  }
});

router.get("/admin/dashboard", function (req, res, next) {
  let Records = AppDAO.getResults();
  res.render("admin/dashboard", {
    title: "Dashboard",
    description: "QNA List ",
    Records: Records,
  });
});

module.exports = router;
