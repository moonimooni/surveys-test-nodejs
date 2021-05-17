require("dotenv").config();

const express = require("express");
const serverless = require("serverless-http");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const adminRouter = require('./routers/admin');

const { SERVER_PORT, MONGO_URI } = process.env;

app.use(bodyParser.json({ strict: false }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use('/admin', adminRouter);

mongoose
  .set('useFindAndModify', false)
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('db server connected');

    return app.listen(SERVER_PORT, () => {
      console.log('port succesfully opened');
    });
  })
  .catch(error => {
    console.log(error);
  });