require("dotenv").config();
process.env.SERVICE_NAME = "user-service";

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
  res.json({ service: "user-service", status: "ok" });
});

app.use("/api/users", require("./routes"));

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  logger.info(
    { port: PORT },
      "user service started"
  );
  });
