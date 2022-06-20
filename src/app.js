const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello World!" + res.statusCode);
});
router.post("/p", (req, res) => {
  res.send("post");
});
app.use("/.netlify/functions/app", router);

module.exports.handler = serverless(app);
