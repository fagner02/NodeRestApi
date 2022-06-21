const express = require("express");
const cors = require("cors");
const serverless = require("serverless-http");
const faunadb = require("faunadb"),
  q = faunadb.query;
const client = new faunadb.Client({
  secret: "fnAEpgi2UHACQWm8giJnsrk5OMp9S0hJk-RhXSB8",
});
const app = express();
const router = express.Router();

var options = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(options));

router.get("/", cors(options), async (req, res) => {
  var d = await client.query(
    q.Map(
      q.Paginate(q.Documents(q.Collection("Test"))),
      q.Lambda("ref", q.Select("data", q.Get(q.Var("ref"))))
    )
  );
  console.log(d);
  return res.send(d.data);
});

router.post("/add", cors(options), async (req, res) => {
  var d = await client.query(
    q.Create(q.Collection("Test"), {
      data: JSON.parse(req.body),
    })
  );
  return res.send(d);
});

router.get("/new", async (req, res) => {
  var options = {
    size: 5,
  };
  if (req.query.page != null) {
    options.after = [
      await client.query(q.Ref(q.Collection("Test"), req.query.page)),
    ];
  }
  let page = await client.query(
    q.Paginate(q.Documents(q.Collection("Test")), options)
  );

  let list = await client.query(
    q.Map(
      page.data,
      q.Lambda((x) => q.Get(x))
    )
  );

  let listSize = await client.query(q.Count(page.data));

  let shouldUpdate = listSize > req.query.size;

  let nextPage = page.after?.[0].id;

  return res.send({ list, shouldUpdate, nextPage, listSize });
});
app.use("/.netlify/functions/app", cors(options), router);

module.exports.handler = serverless(app);
