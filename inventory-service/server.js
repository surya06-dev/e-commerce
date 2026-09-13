require("dotenv").config();

const express = require("express");
const pino = require("pino");
const pinoHttp = require("pino-http");

const connectDB = require("./db");

const app = express();

const logger = pino({
  level: process.env.LOG_LEVEL || "info"
});

app.use(
  pinoHttp({
    logger
  })
);

app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.json({
    service: "inventory-service",
    status: "ok"
  });
});

app.use("/api/inventory", require("./routes"));

const PORT = process.env.PORT || 4005;

app.listen(PORT, () => {
  logger.info(
    {
      service: "inventory-service",
      port: PORT
    },
    "Inventory service started"
  );
});