import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  Server,
  Database,
  Cpu,
  Zap,
  Shield,
  Activity,
  Play,
  RotateCcw,
  CheckCircle2,
  ArrowRight,
  Code2,
  Terminal,
  Clock,
  Sparkles,
  GitBranch,
  Radio,
  BarChart3,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

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

const PIPELINES: ArchitecturePipeline[] = [
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
          code: `// Cloudflare Rate Limiting Rule\n{\n  "expression": "http.request.uri.path contains '/api/webhook'",\n  "action": "execute",\n  "rate_limit": {\n    "requests": 1000,\n    "period": 60,\n    "mitigation": "challenge"\n  }\n}`,
        },
      },
      {
        id: 'fastapi-gateway',
        name: 'FastAPI Ingestion Gateway',
        category: 'service',
        icon: Zap,
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        tag: 'Non-blocking I/O',
        summary: 'Telegramdan kelgan yangilanishlarni (updates) 10ms dan kam vaqtda qabul qilib, tezkor 200 OK qaytaradi.',
        metrics: {
          latency: '2.4ms',
          throughput: '12,500 rps',
          techStack: ['FastAPI', 'Uvicorn (uvloop)', 'Pydantic v2', 'asyncpg'],
          resilience: 'Horizontal Auto-scaling (K8s)',
        },
        codeSnippet: {
          filename: 'webhook_receiver.py',
          code: `@app.post("/webhook/telegram", status_code=status.HTTP_200_OK)\nasync def handle_telegram_update(update: TelegramUpdateSchema):\n    # 1. Immediate HMAC Validation\n    verify_telegram_signature(update)\n    # 2. Push to Redis Stream in < 1ms\n    await redis_client.xadd("stream:telegram_updates", update.model_dump())\n    return {"status": "queued"}`,
        },
      },
      {
        id: 'redis-queue',
        name: 'Redis Stream & Message Broker',
        category: 'queue',
        icon: Radio,
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
        tag: 'In-Memory Pipeline',
        summary: 'Xabarlar navbatini xotirada saqlash, qayta urinishlar (retries) va Consumer Group taqsimoti.',
        metrics: {
          latency: '0.45ms',
          throughput: '85,000 ops/s',
          techStack: ['Redis Cluster 7.x', 'Redis Streams', 'Consumer Groups'],
          resilience: 'AOF + RDB Persistence',
        },
        codeSnippet: {
          filename: 'stream_publisher.py',
          code: `async def publish_event(event_type: str, payload: dict):\n    stream_key = f"events:{event_type}"\n    message_id = await redis.xadd(\n        name=stream_key,\n        fields={"data": json.dumps(payload)},\n        maxlen=50000,\n        approximate=True\n    )\n    return message_id`,
        },
      },
      {
        id: 'celery-workers',
        name: 'Celery Distributed Workers',
        category: 'service',
        icon: Cpu,
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20',
        tag: 'Background Task Pool',
        summary: 'Og‘ir hisob-kitoblar, tashqi API integratsiyalari va media yuklashlarni asinxron bajaruvchi ishchilar armiyasi.',
        metrics: {
          latency: '14.8ms',
          throughput: '4,000 tasks/s',
          techStack: ['Celery 5.x', 'Python 3.12', 'RabbitMQ Broker', 'Boto3'],
          resilience: 'Dead-Letter Queue + Exponential Backoff',
        },
        codeSnippet: {
          filename: 'tasks.py',
          code: `@celery_app.task(bind=True, max_retries=3, default_retry_delay=5)\ndef process_order_notification(self, user_id: int, invoice_id: str):\n    try:\n        user = db.query(User).get(user_id)\n        send_bot_invoice(user.chat_id, invoice_id)\n    except TelegramApiError as exc:\n        raise self.retry(exc=exc)`,
        },
      },
      {
        id: 'postgres-db',
        name: 'PostgreSQL (Master + Read Replicas)',
        category: 'db',
        icon: Database,
        color: 'text-blue-400 border-blue-500/40 bg-blue-950/20',
        tag: 'ACID Relational Storage',
        summary: 'Foydalanuvchilar, buyurtmalar, to‘lovlar va tranzaksiyalar tarixining ishonchli relyatsion ombori.',
        metrics: {
          latency: '3.1ms',
          throughput: '6,500 qps',
          techStack: ['PostgreSQL 16', 'PgBouncer', 'WAL Archiving', 'B-Tree & GIN'],
          resilience: 'Patroni HA + Streaming Replication',
        },
        codeSnippet: {
          filename: 'db_pool.py',
          code: `async def get_db_pool():\n    return await asyncpg.create_pool(\n        dsn=settings.DATABASE_URL,\n        min_size=10,\n        max_size=50,\n        max_queries=50000,\n        command_timeout=10.0\n    )`,
        },
      },
      {
        id: 'prometheus-grafana',
        name: 'Prometheus & Grafana Alerting',
        category: 'monitoring',
        icon: BarChart3,
        color: 'text-cyan-400 border-cyan-500/40 bg-cyan-950/20',
        tag: 'Real-time Observability',
        summary: 'Har bir endpointning p95/p99 kechikishi, xatolar ulushi (5xx) va server resurslarini 24/7 kuzatib borish.',
        metrics: {
          latency: 'Real-time',
          throughput: 'Scrape 5s interval',
          techStack: ['Prometheus', 'Grafana Dashboards', 'Alertmanager'],
          resilience: 'Multi-AZ Federation',
        },
        codeSnippet: {
          filename: 'metrics_middleware.py',
          code: `REQUEST_LATENCY = Histogram(\n    "http_request_duration_seconds",\n    "HTTP Request Latency in seconds",\n    ["method", "endpoint", "status_code"],\n    buckets=[0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1.0]\n)`,
        },
      },
    ],
    requestFlowSteps: [
      {
        nodeId: 'cloudflare',
        title: '1. HTTPS Request Ingestion',
        log: 'Cloudflare WAF validated TLS 1.3 fingerprint, zero DDoS anomalies detected.',
        durationMs: 1.2,
      },
      {
        nodeId: 'fastapi-gateway',
        title: '2. Signature Verification & Route Dispatch',
        log: 'FastAPI gateway verified HMAC-SHA256 signature and deserialized Pydantic v2 payload.',
        durationMs: 2.1,
      },
      {
        nodeId: 'redis-queue',
        title: '3. Atomic In-Memory Enqueue',
        log: 'Pushed task to Redis Stream with XADD id=1725048291048-0.',
        durationMs: 0.8,
      },
      {
        nodeId: 'celery-workers',
        title: '4. Worker Execution & Business Logic',
        log: 'Celery worker consumed event, generated dynamic invoice PDF, and executed transaction logic.',
        durationMs: 12.4,
      },
      {
        nodeId: 'postgres-db',
        title: '5. ACID Transaction Commit',
        log: 'Committed PostgreSQL write transaction with row-level lock in 2.8ms.',
        durationMs: 2.8,
      },
      {
        nodeId: 'prometheus-grafana',
        title: '6. Telemetry & Metrics Scraped',
        log: 'Recorded 200 OK metric, p99 latency 19.3ms pushed to Prometheus bucket.',
        durationMs: 0.5,
      },
    ],
  },
  {
    id: 'fintech-microservices',
    title: 'FinTech Payment & Wallet Distributed Architecture',
    badge: 'Zero-Data-Loss ACID',
    description:
      "Balans tranzaksiyalari, to'lov shlyuzlari (Payme/Click) va ikki tomonlama buxgalteriya yozuvlari uchun mo'ljallangan taqsimlangan mikroxizmatlar.",
    nodes: [
      {
        id: 'api-gateway',
        name: 'API Gateway & Rate Limiter',
        category: 'gateway',
        icon: Zap,
        color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20',
        tag: 'JWT Auth & Token Bucket',
        summary: 'Har bir so‘rovni autentifikatsiya qilish, rollar (RBAC) va IP rate limiting.',
        metrics: {
          latency: '1.8ms',
          throughput: '20,000 rps',
          techStack: ['Nginx', 'FastAPI', 'JWT HS256', 'Redis TokenBucket'],
          resilience: 'Active-Active Gateway Failover',
        },
        codeSnippet: {
          filename: 'rate_limiter.py',
          code: `async def check_rate_limit(client_ip: str) -> bool:\n    current_tokens = await redis.decr(f"rate:{client_ip}")\n    if current_tokens < 0:\n        raise HTTPException(status_code=429, detail="Too Many Requests")\n    return True`,
        },
      },
      {
        id: 'auth-service',
        name: 'Auth & Identity Service',
        category: 'service',
        icon: Shield,
        color: 'text-indigo-400 border-indigo-500/40 bg-indigo-950/20',
        tag: 'OAuth2 / MFA / Session',
        summary: 'Foydalanuvchi sessiyalarini boshqarish, tokenlarni yangilash (refresh) va xavfsizlik loglari.',
        metrics: {
          latency: '2.1ms',
          throughput: '8,000 rps',
          techStack: ['Python', 'Argon2id', 'PyJWT', 'Redis Session'],
          resilience: 'Stateless JWT Architecture',
        },
        codeSnippet: {
          filename: 'token_manager.py',
          code: `def create_secure_session(user_id: str) -> dict:\n    payload = {"sub": user_id, "iat": now(), "exp": now() + timedelta(minutes=15)}\n    access_token = jwt.encode(payload, SECRET_KEY, algorithm="HS256")\n    return {"access_token": access_token, "token_type": "bearer"}`,
        },
      },
      {
        id: 'payment-engine',
        name: 'Payment & Double-Entry Ledger',
        category: 'service',
        icon: Server,
        color: 'text-amber-400 border-amber-500/40 bg-amber-950/20',
        tag: 'Idempotent Ledger',
        summary: 'To‘lovlarni ikki tomonlama hisob tizimida (debet/kredit) atomik o‘tkazish va duplicate to‘lovlarni oldini olish.',
        metrics: {
          latency: '8.5ms',
          throughput: '2,500 tx/s',
          techStack: ['FastAPI', 'SQLAlchemy 2.0', 'Idempotency Keys', 'PostgreSQL CTE'],
          resilience: 'Saga Pattern for Distributed Transactions',
        },
        codeSnippet: {
          filename: 'ledger_transaction.py',
          code: `async def transfer_balance(session, from_acc, to_acc, amount):\n    async with session.begin():\n        await session.execute(\n            "UPDATE accounts SET balance = balance - :amt WHERE id = :src AND balance >= :amt",\n            {"amt": amount, "src": from_acc}\n        )\n        await session.execute(\n            "UPDATE accounts SET balance = balance + :amt WHERE id = :dst",\n            {"amt": amount, "dst": to_acc}\n        )`,
        },
      },
      {
        id: 'rabbitmq-bus',
        name: 'RabbitMQ Enterprise Event Bus',
        category: 'queue',
        icon: Radio,
        color: 'text-rose-400 border-rose-500/40 bg-rose-950/20',
        tag: 'AMQP 0-9-1 Reliable Routing',
        summary: 'Xizmatlararo xabarlarni kafolatlangan yetkazib berish (ACK/NACK) va topic-based routing.',
        metrics: {
          latency: '1.1ms',
          throughput: '35,000 msg/s',
          techStack: ['RabbitMQ 3.12', 'Quorum Queues', 'aio_pika'],
          resilience: 'Clustered Mirrored Queues',
        },
        codeSnippet: {
          filename: 'event_bus.py',
          code: `async def publish_payment_success(payment_id: str, amount: float):\n    message = Message(json.dumps({"payment_id": payment_id, "amount": amount}).encode())\n    await exchange.publish(message, routing_key="payment.success")`,
        },
      },
    ],
    requestFlowSteps: [
      {
        nodeId: 'api-gateway',
        title: '1. Ingress & Token Validation',
        log: 'Validated Bearer Token & deducted TokenBucket rate limiter.',
        durationMs: 1.5,
      },
      {
        nodeId: 'auth-service',
        title: '2. RBAC Permission Check',
        log: 'User session active, scope "wallet:transfer" verified.',
        durationMs: 1.8,
      },
      {
        nodeId: 'payment-engine',
        title: '3. Double-Entry Balance Deduction',
        log: 'Acquired SELECT ... FOR UPDATE row lock, balance updated atomically.',
        durationMs: 6.2,
      },
      {
        nodeId: 'rabbitmq-bus',
        title: '4. Async Event Broadcast',
        log: 'Published "payment.success" event to notification and accounting queues.',
        durationMs: 0.9,
      },
    ],
  },
];

export const SystemArchitectureVisualizer: React.FC = () => {
  const { language } = useLanguage();
  const [selectedPipelineId, setSelectedPipelineId] = useState<string>(PIPELINES[0].id);
  const [selectedNodeId, setSelectedNodeId] = useState<string>(PIPELINES[0].nodes[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [simLogs, setSimLogs] = useState<string[]>([]);

  const activePipeline = PIPELINES.find((p) => p.id === selectedPipelineId) || PIPELINES[0];
  const activeNode = activePipeline.nodes.find((n) => n.id === selectedNodeId) || activePipeline.nodes[0];

  // Handle Simulation
  const handleRunSimulation = async () => {
    if (isSimulating) return;
    setIsSimulating(true);
    setCurrentStepIndex(0);
    setSimLogs([`🚀 [${new Date().toLocaleTimeString()}] Tranzaksiya oqimi ishga tushirildi...`]);

    for (let i = 0; i < activePipeline.requestFlowSteps.length; i++) {
      const step = activePipeline.requestFlowSteps[i];
      setCurrentStepIndex(i);
      setSelectedNodeId(step.nodeId);

      setSimLogs((prev) => [
        ...prev,
        `⚡ [${step.durationMs}ms] ${step.title}: ${step.log}`,
      ]);

      await new Promise((r) => setTimeout(r, 900));
    }

    setSimLogs((prev) => [
      ...prev,
      `✅ [${new Date().toLocaleTimeString()}] Barcha bosqichlar 0 ta xato bilan 100% muvaffaqiyatli yakunlandi!`,
    ]);
    setIsSimulating(false);
  };

  const handleResetSimulation = () => {
    setIsSimulating(false);
    setCurrentStepIndex(-1);
    setSimLogs([]);
    setSelectedNodeId(activePipeline.nodes[0].id);
  };

  return (
    <section id="architecture-visualizer" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-400 font-mono text-xs">
          <Layers className="w-3.5 h-3.5" />
          <span>PRODUCTION-READY SYSTEM ARCHITECTURE</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white font-mono">
          Mikroxizmatlar & Tizim Arxitekturasi Xaritasi
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
          Yuqori yuklamali (High-Load) backend tizimlarning so‘rovlar oqimi, kesh qatlamlari, navbatlar va ma’lumotlar bazasi topologiyasini interaktiv boshqaring.
        </p>
      </div>

      {/* Pipeline Selector Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
        {PIPELINES.map((pipe) => {
          const isSelected = pipe.id === selectedPipelineId;
          return (
            <button
              key={pipe.id}
              onClick={() => {
                setSelectedPipelineId(pipe.id);
                setSelectedNodeId(pipe.nodes[0].id);
                handleResetSimulation();
              }}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs sm:text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer border ${
                isSelected
                  ? 'bg-blue-600 text-white border-blue-500 shadow-lg shadow-blue-600/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-400'
              }`}
            >
              <GitBranch className="w-4 h-4" />
              <span>{pipe.title}</span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-normal ${
                  isSelected ? 'bg-blue-800 text-blue-200' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {pipe.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Architecture Interactive Canvas & Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Architecture Flow Chart Canvas */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-500" />
              <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                Mikroxizmatlar Topologiyasi ({activePipeline.nodes.length} ta tugun)
              </span>
            </div>

            {/* Simulation Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-mono text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isSimulating ? 'Oqim Ishlamoqda...' : 'So‘rovni Simulyatsiya Qilish'}</span>
              </button>

              {simLogs.length > 0 && (
                <button
                  onClick={handleResetSimulation}
                  className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors cursor-pointer"
                  title="Qayta o'rnatish"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Interactive Topology Node Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative">
            {activePipeline.nodes.map((node, index) => {
              const isSelected = node.id === selectedNodeId;
              const isCurrentStep =
                currentStepIndex >= 0 && activePipeline.requestFlowSteps[currentStepIndex]?.nodeId === node.id;
              const Icon = node.icon;

              return (
                <motion.div
                  key={node.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/30 shadow-md ring-2 ring-blue-500/20'
                      : 'border-slate-200 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-950/50 hover:border-slate-300 dark:hover:border-slate-700'
                  } ${isCurrentStep ? 'ring-4 ring-emerald-500/40 border-emerald-500' : ''}`}
                >
                  {/* Step Active Indicator Ping */}
                  {isCurrentStep && (
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-[10px] font-mono font-bold text-emerald-500 uppercase">Live Step</span>
                    </div>
                  )}

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border ${node.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-mono text-slate-400">#{index + 1}</span>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                          {node.name}
                        </h4>
                      </div>
                      <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-medium">
                        {node.tag}
                      </span>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                        {node.summary}
                      </p>
                    </div>
                  </div>

                  {/* Micro metric pills */}
                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400">
                    <span>⏱️ {node.metrics.latency}</span>
                    <span>⚡ {node.metrics.throughput}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Real-Time Simulation Console Stream */}
          {simLogs.length > 0 && (
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 font-mono text-xs space-y-1.5 text-slate-300">
              <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5 mb-2">
                <span className="flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Real-time Traffic Trace Console</span>
                </span>
                <span className="text-emerald-400">STATUS: {isSimulating ? 'IN_PROGRESS' : 'COMPLETED'}</span>
              </div>
              <div className="max-h-36 overflow-y-auto space-y-1 no-scrollbar">
                {simLogs.map((log, i) => (
                  <div key={i} className="leading-relaxed">
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Selected Node Deep Technical Inspector */}
        <div className="lg:col-span-5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 uppercase">
                  {activeNode.category}
                </span>
                <span className="text-xs text-slate-400 font-mono">Deep Node Inspector</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-1">
                {activeNode.name}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {activeNode.summary}
          </p>

          {/* Performance & Resilience Cards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">Kechikish (p99 Latency)</div>
              <div className="text-base font-bold font-mono text-emerald-500 mt-0.5">
                {activeNode.metrics.latency}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800">
              <div className="text-[10px] font-mono text-slate-400">O‘tkazuvchanlik (Throughput)</div>
              <div className="text-base font-bold font-mono text-blue-500 mt-0.5">
                {activeNode.metrics.throughput}
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase">
              Ishlatilgan Texnologiyalar & Standartlar:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {activeNode.metrics.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-mono bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {/* Production Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Code2 className="w-3.5 h-3.5 text-blue-500" />
                <span>{activeNode.codeSnippet.filename}</span>
              </span>
              <span className="text-[10px] text-slate-400">Production Code</span>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed overflow-x-auto border border-slate-800">
              <code>{activeNode.codeSnippet.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
};
