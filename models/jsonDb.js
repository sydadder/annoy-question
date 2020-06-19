"use strict";
const JsonRecords = require("json-records");
const groupBy = require("json-groupby");
const qnaDB = new JsonRecords("qna.json");

//Current date timestamp
const getCurrentTime = () => {
  let ts = Date.now();
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();
  let hour = date_ob.getHours();
  let minute = date_ob.getMinutes();
  let second = date_ob.getSeconds();

  // prints date & time in YYYY-MM-DD format
  let currentDateTime =
    year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
  return currentDateTime;
};

//Add Records
const insert = (
  PostEmail,
  PostQuestion,
  PostCorrectAnswer,
  PostIncorrectAnswer,
  PostComment,
  identifier
) => {
  qnaDB.add({
    authorEmail: PostEmail,
    question: PostQuestion,
    correctAnswer: PostCorrectAnswer,
    incorrectAnswer: PostIncorrectAnswer,
    PostComment: PostComment,
    identifier: identifier,
    creation_time: getCurrentTime(), //Default current timestamp
  });
};

//Retrieve records
const getResults = () => {
  let results = {};
  const allRecords = qnaDB.get();
  results = groupBy(allRecords, ["authorEmail"]);
  return results;
};

//Retrieve records
let getResult = (hash) => {
  console.log("Came inside get results");
  let results = {};
  const filteredRecords = qnaDB.get((record) => record.identifier == hash);
  return filteredRecords[0];
};

// Remove records by filter.
let removeRecord = (hash) => {
  qnaDB.remove((record) => record.identifier == hash);
};

module.exports.getResults = getResults;
module.exports.getResult = getResult;
module.exports.insert = insert;
module.exports.removeRecord = removeRecord;
