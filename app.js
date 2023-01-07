require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./api");
const morgan = require("morgan");
const cors = require("cors");
const client = require("./db/client");

client.connect();

app.use(cors());

// Setup your Middleware and API Router here
app.use(morgan("dev"));
app.use(express.json());
app.use("/api", router);
// changed apiRouter to router

app.get("*", (req, res, next) => {
  res.status(404);
  next({
    name: "404 - not found",
    message: "no route found for the requested url",
  });
});

app.use((error, req, res, next) => {
  console.error("server error: ", error);
  if (res.statusCode < 400) res.status(500);
  console.log({
    error: error.message,
    name: error.name,
    message: error.message,
    table: error.table,
  });
  res.send({
    error: error.message,
    name: error.name,
    message: error.message,
    tabel: error.table,
  });
});

module.exports = app;
