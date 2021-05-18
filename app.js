require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

const adminRouter = require("./routers/admin");
const surveyRouter = require("./routers/survey");

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/admin", adminRouter);
app.use("/survey", surveyRouter);

module.exports.handler = serverless(app);