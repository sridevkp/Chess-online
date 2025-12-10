/*instrumentation.ts*/
const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { RuntimeNodeInstrumentation } = require('@opentelemetry/instrumentation-runtime-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { OTLPMetricExporter } = require('@opentelemetry/exporter-metrics-otlp-http');
const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

require("dotenv").config();
const otlp_url = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318'

const traceExporter = new OTLPTraceExporter({
  // optional, default is http://localhost:4318/v1/traces
  url: `${otlp_url}/v1/traces`,
});

const metricExporter = new OTLPMetricExporter({
  // optional, default is http://localhost:4318/v1/metrics
  url: `${otlp_url}/v1/metrics`,
});

const sdk = new NodeSDK({
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 10_000, // 10s, good for dev; prod often 60s
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
    new RuntimeNodeInstrumentation(), 
],
});


sdk.start()
// Graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('OTel SDK shut down'))
    .catch((err) => console.error('Error shutting down OTel SDK', err))
    .finally(() => process.exit(0));
});

console.log("OpenTelemetry Initialized")