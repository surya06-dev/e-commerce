require("dotenv").config();
process.env.SERVICE_NAME = "payment-service";

const express = require("express");
const pinoHttp = require("pino-http");
const connectDB = require("./db");
const logger = require("./logger");

const app = express();

app.use(
  pinoHttp({
    logger,
  })
);

app.use(express.json());

connectDB();

app.get("/health", (req, res) => {
  res.json({ service: "payment-service", status: "ok" });
});

app.use("/api/payments", require("./routes"));

const PORT = process.env.PORT || 4004;
app.listen(PORT, () => {
  logger.info(
    { port: PORT },
      "payment service started"
  );
});
