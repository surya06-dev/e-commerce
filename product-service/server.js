require("dotenv").config();
process.env.SERVICE_NAME = "product-service";

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
  res.json({ service: "product-service", status: "ok" });
});

app.use("/api/products", require("./routes"));

const PORT = process.env.PORT || 4002;
app.listen(PORT, () => {
    logger.info(
    { port: PORT },
      "product service started"
  );
 });
