const { NodeSDK } = require("@opentelemetry/sdk-node");

const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");

const {
  PrometheusExporter,
} = require("@opentelemetry/exporter-prometheus");


const prometheusExporter = new PrometheusExporter({
  port: 9464,
});


const sdk = new NodeSDK({
  metricReader: prometheusExporter,

  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});


sdk.start();

console.log("OpenTelemetry initialized");
