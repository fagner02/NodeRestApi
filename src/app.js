const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();
var k = [];

var options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));

router.get("/", cors(options), (req, res) => {
  return res.send(k.join());
});
router.post("/p", cors(options), (req, res) => {
  k.push("wed");
  return res.send("ok");
});
app.use("/.netlify/functions/app", cors(options), router);

module.exports.handler = serverless(app);
