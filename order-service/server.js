require("dotenv").config();
process.env.SERVICE_NAME = "order-service";

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
  res.json({ service: "order-service", status: "ok" });
});

app.use("/api/orders", require("./routes"));

const PORT = process.env.PORT || 4003;
app.listen(PORT, () => {
  logger.info(
    { port: PORT },
      "Order service started"
  );
  
});
