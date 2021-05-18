require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { MONGO_URI } = process.env;

const adminRouter = require("./routers/admin");

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/admin", adminRouter);

app.get("/", (req, res, next) => {
  res.status(200).json({ MESSAGE: "OK" });
});

module.exports.handler = serverless(app);