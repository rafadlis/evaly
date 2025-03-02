import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-node';
import { registerOTel } from '@vercel/otel';

export function register() {
  registerOTel({
    serviceName: 'evaly-web-service',
    spanProcessors: [
      new SimpleSpanProcessor(
        new OTLPTraceExporter({
          url: 'https://api.axiom.co/v1/traces',
          headers: {
            Authorization: `Bearer ${process.env.API_TOKEN}`,
            'X-Axiom-Dataset': `${process.env.DATASET_NAME}`,
          },
        })
      ),
    ],
  });
}