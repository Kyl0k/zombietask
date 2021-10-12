const express = require("express");
const app = express();
const cors = require("cors");
const xss = require("xss-clean");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const zombieRouter = require("./routes/zombieRoutes");
const itemsRouter = require("./routes/itemsRoutes");

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(mongoSanitize());
app.use(xss());
app.use("/api", zombieRouter);
app.use("/api", itemsRouter);

app.all("*", (req, res, next) => {
  return res.status(404).json({
    error: {
      status: "fail",
      message: "Page not found. Check if your link has the correct address",
    },
  });
});

app.use((err, req, res, next) => {
  if (err.name === "SyntaxError") {
    return res.status(400).json({
      error: {
        status: "fail",
        message:
          "Syntax Error. Make sure you are sending your data in correct way.",
      },
    });
  } else if (err.name === "ValidationError") {
    if (err.errors) {
      return res.status(400).json({
        error: {
          status: "fail",
          message: err.message,
        },
      });
    }
    return res.status(400).json({
      error: {
        status: "fail",
        message: `Path ${err.details.body[0].message}`,
      },
    });
  } else if (err.name === "ZombieError") {
    return res.status(err.statusCode).json({
      status: "fail",
      message: err.message,
    });
  } else if (err.name === "CastError") {
    return res.status(400).json({
      status: "fail",
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: "error",
      message: "Something wrong happened",
    });
  }
});

module.exports = app;
