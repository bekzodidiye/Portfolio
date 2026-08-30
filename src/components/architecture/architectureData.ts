import React from 'react';
import { Shield, Zap, Radio, Cpu, Database, BarChart3, Server } from 'lucide-react';

export interface ArchitectureNode {
  id: string;
  name: string;
  category: 'gateway' | 'service' | 'queue' | 'db' | 'cache' | 'monitoring';
  icon: React.ElementType;
  color: string;
  tag: string;
  summary: string;
  metrics: {
    latency: string;
    throughput: string;
    techStack: string[];
    resilience: string;
  };
  codeSnippet: {
    filename: string;
    code: string;
  };
}

export interface ArchitecturePipeline {
  id: string;
  title: string;
  badge: string;
  description: string;
  nodes: ArchitectureNode[];
  requestFlowSteps: Array<{
    nodeId: string;
    title: string;
    log: string;
    durationMs: number;
  }>;
}

export const ARCHITECTURE_PIPELINES: ArchitecturePipeline[] = [
  {
    id: 'high-load-bot',
    title: 'High-Load Async Telegram Webhook & Queue Processing',
    badge: '10,000+ Req/Sec',
    description:
      "Telegram Bot API va keng ko'lamli webhooklarni qabul qilib, Celery ishchi oqimlari va Redis Stream orqali asinxron qayta ishlash arxitekturasi.",
    nodes: [
      {
        id: 'cloudflare',
        name: 'Cloudflare Edge / WAF',
        category: 'gateway',
        icon: Shield,
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
        tag: 'DDoS & SSL Termination',
        summary: 'Tashqi tarmoq so‘rovlarini filtrlash, bot hujumlaridan himoya va SSL sertifikatini terminatsiya qilish.',
        metrics: {
          latency: '1.2ms',
          throughput: '50,000+ rps',
          techStack: ['Cloudflare Enterprise', 'WAF Rules', 'Geo DNS'],
          resilience: '99.999% SLA',
        },
        codeSnippet: {
          filename: 'cloudflare_waf_rules.json',
          code: `{\n  "expression": "http.request.uri.path contains '/api/webhook'",\n  "action": "execute",\n  "rate_limit": { "requests": 1000, "period": 60 }\n}`,
        },
      },
      {
        id: 'fastapi-gateway',
        name: 'FastAPI Ingestion Gateway',
        category: 'service',
        icon: Zap,
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        tag: 'Non-blocking I/O',
        summary: 'Telegramdan kelgan yangilanishlarni 10ms dan kam vaqtda qabul qilib, tezkor 200 OK qaytaradi.',
        metrics: {
          latency: '2.4ms',
          throughput: '12,500 rps',
          techStack: ['FastAPI', 'Uvicorn (uvloop)', 'Pydantic v2', 'asyncpg'],
          resilience: 'Horizontal Auto-scaling (K8s)',
        },
        codeSnippet: {
          filename: 'webhook_receiver.py',
          code: `@app.post("/webhook/telegram")\nasync def handle_update(update: TelegramUpdate):\n    verify_signature(update)\n    await redis_client.xadd("stream:updates", update.dict())\n    return {"status": "queued"}`,
        },
      },
      {
        id: 'redis-queue',
        name: 'Redis Stream & Message Broker',
        category: 'queue',
        icon: Radio,
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
        tag: 'In-Memory Pipeline',
        summary: 'Xabarlar navbatini xotirada saqlash, qayta urinishlar va Consumer Group taqsimoti.',
        metrics: {
          latency: '0.45ms',
          throughput: '85,000 ops/s',
          techStack: ['Redis Cluster 7.x', 'Redis Streams', 'Consumer Groups'],
          resilience: 'AOF + RDB Persistence',
        },
        codeSnippet: {
          filename: 'stream_publisher.py',
          code: `async def publish_event(payload: dict):\n    return await redis.xadd("events:stream", {"data": json.dumps(payload)})`,
        },
      },
      {
        id: 'celery-workers',
        name: 'Celery Distributed Workers',
        category: 'service',
        icon: Cpu,
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20',
        tag: 'Background Task Pool',
        summary: 'Og‘ir hisob-kitoblar va media yuklashlarni asinxron bajaruvchi ishchilar armiyasi.',
        metrics: {
          latency: '14.8ms',
          throughput: '4,000 tasks/s',
          techStack: ['Celery 5.x', 'Python 3.12', 'RabbitMQ Broker'],
          resilience: 'Dead-Letter Queue + Exponential Backoff',
        },
        codeSnippet: {
          filename: 'tasks.py',
          code: `@celery_app.task(bind=True, max_retries=3)\ndef process_order(self, user_id: int):\n    send_bot_invoice(user_id)`,
        },
      },
      {
        id: 'postgres-db',
        name: 'PostgreSQL (Master + Replicas)',
        category: 'db',
        icon: Database,
        color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
        tag: 'ACID Relational Storage',
        summary: 'Foydalanuvchilar va to‘lovlar tarixining ishonchli relyatsion ombori.',
        metrics: {
          latency: '3.1ms',
          throughput: '6,500 qps',
          techStack: ['PostgreSQL 16', 'PgBouncer', 'B-Tree & GIN'],
          resilience: 'Patroni HA + Streaming Replication',
        },
        codeSnippet: {
          filename: 'db_pool.py',
          code: `async def get_pool():\n    return await asyncpg.create_pool(dsn=DATABASE_URL, min_size=10, max_size=50)`,
        },
      },
      {
        id: 'prometheus-grafana',
        name: 'Prometheus & Grafana Alerting',
        category: 'monitoring',
        icon: BarChart3,
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
        tag: 'Real-time Observability',
        summary: 'Endpointlarning p95/p99 kechikishi va server resurslarini 24/7 kuzatib borish.',
        metrics: {
          latency: 'Real-time',
          throughput: 'Scrape 5s interval',
          techStack: ['Prometheus', 'Grafana Dashboards'],
          resilience: 'Multi-AZ Federation',
        },
        codeSnippet: {
          filename: 'metrics.py',
          code: `REQUEST_LATENCY = Histogram("http_duration", "Latency", ["endpoint", "status"])`,
        },
      },
    ],
    requestFlowSteps: [
      { nodeId: 'cloudflare', title: '1. HTTPS Ingestion', log: 'WAF validated TLS 1.3 fingerprint, 0 DDoS.', durationMs: 1.2 },
      { nodeId: 'fastapi-gateway', title: '2. HMAC Verify', log: 'FastAPI gateway verified signature in 2.1ms.', durationMs: 2.1 },
      { nodeId: 'redis-queue', title: '3. Atomic Push', log: 'Pushed task to Redis Stream with XADD.', durationMs: 0.8 },
      { nodeId: 'celery-workers', title: '4. Worker Process', log: 'Celery worker generated dynamic invoice PDF.', durationMs: 12.4 },
      { nodeId: 'postgres-db', title: '5. ACID Commit', log: 'Committed PostgreSQL write transaction.', durationMs: 2.8 },
      { nodeId: 'prometheus-grafana', title: '6. Telemetry Pushed', log: 'Recorded 200 OK metric, p99 latency 19.3ms.', durationMs: 0.5 },
    ],
  },
  {
    id: 'fintech-microservices',
    title: 'FinTech Payment & Wallet Distributed Architecture',
    badge: 'Zero-Data-Loss ACID',
    description: "Balans tranzaksiyalari va to'lov shlyuzlari uchun taqsimlangan mikroxizmatlar.",
    nodes: [
      {
        id: 'api-gateway',
        name: 'API Gateway & Rate Limiter',
        category: 'gateway',
        icon: Zap,
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        tag: 'JWT Auth & Token Bucket',
        summary: 'Har bir so‘rovni autentifikatsiya qilish va IP rate limiting.',
        metrics: { latency: '1.8ms', throughput: '20,000 rps', techStack: ['Nginx', 'FastAPI', 'JWT'], resilience: 'Active-Active Gateway' },
        codeSnippet: { filename: 'gateway.py', code: `async def check_limit(ip):\n    if await redis.decr(f"rate:{ip}") < 0:\n        raise HTTPException(429)` },
      },
      {
        id: 'payment-engine',
        name: 'Payment & Double-Entry Ledger',
        category: 'service',
        icon: Server,
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
        tag: 'Idempotent Ledger',
        summary: 'To‘lovlarni ikki tomonlama hisob tizimida atomik o‘tkazish.',
        metrics: { latency: '8.5ms', throughput: '2,500 tx/s', techStack: ['FastAPI', 'SQLAlchemy 2.0'], resilience: 'Saga Pattern' },
        codeSnippet: { filename: 'ledger.py', code: `async with session.begin():\n    await session.execute("UPDATE accounts SET balance = balance - :amt WHERE id = :src")` },
      },
      {
        id: 'rabbitmq-bus',
        name: 'RabbitMQ Enterprise Event Bus',
        category: 'queue',
        icon: Radio,
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
        tag: 'AMQP 0-9-1 Reliable Routing',
        summary: 'Xizmatlararo xabarlarni kafolatlangan yetkazib berish.',
        metrics: { latency: '1.1ms', throughput: '35,000 msg/s', techStack: ['RabbitMQ', 'Quorum Queues'], resilience: 'Clustered Queues' },
        codeSnippet: { filename: 'bus.py', code: `await exchange.publish(message, routing_key="payment.success")` },
      },
    ],
    requestFlowSteps: [
      { nodeId: 'api-gateway', title: '1. Ingress & Token', log: 'Validated Bearer Token.', durationMs: 1.5 },
      { nodeId: 'payment-engine', title: '2. Ledger Deduction', log: 'Acquired row lock, balance updated.', durationMs: 6.2 },
      { nodeId: 'rabbitmq-bus', title: '3. Event Broadcast', log: 'Published "payment.success" event.', durationMs: 0.9 },
    ],
  },
];
