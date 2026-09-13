require("dotenv").config();
process.env.SERVICE_NAME = "notification-service";

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
  res.json({ service: "notification-service", status: "ok" });
});

app.use("/api/notifications", require("./routes"));

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
   logger.info(
    { port: PORT },
      "notification service started"
  );
});
