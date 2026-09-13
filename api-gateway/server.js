require('dotenv').config();
process.env.SERVICE_NAME = "api-gateway";

const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const pinoHttp = require("pino-http");
const logger = require("./logger");

const app = express();

// HTTP request logging
app.use(
  pinoHttp({
    logger,
  })
);

app.use(cors());

// The gateway is the single entry point for clients.
// It doesn't own a database -- it just routes requests to the
// service responsible for that resource.
const routes = [
  { path: '/api/users', target: process.env.USER_SERVICE_URL },
  { path: '/api/products', target: process.env.PRODUCT_SERVICE_URL },
  { path: '/api/orders', target: process.env.ORDER_SERVICE_URL },
  { path: '/api/payments', target: process.env.PAYMENT_SERVICE_URL },
  { path: '/api/inventory', target: process.env.INVENTORY_SERVICE_URL },
  { path: '/api/notifications', target: process.env.NOTIFICATION_SERVICE_URL },
];

routes.forEach(({ path, target }) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,

      pathRewrite: (_path, req) => req.originalUrl,
    })
  );

  logger.info(
    { path, target },
    "Gateway route configured"
  );
});

app.get('/health', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'ok',
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  logger.info(
    { port: PORT },
    "API Gateway started"
  );
});