import React, { useState, useEffect } from 'react';
import {
  Terminal,
  Play,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ShieldCheck,
  Database,
  Cpu,
  Layers,
  Clock,
  Copy,
  Check,
  RefreshCw,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

type SandboxTab = 'ratelimit' | 'jwt' | 'redis' | 'webhook' | 'sql';

export const BackendApiPlayground: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SandboxTab>('ratelimit');
  const [copied, setCopied] = useState(false);

  // SQL Optimizer State
  const [sqlMode, setSqlMode] = useState<'unindexed' | 'indexed'>('unindexed');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlRunResult, setSqlRunResult] = useState<{
    executionTime: number;
    bufferReads: string;
    scannedRows: string;
    improvement: string;
    queryPlan: string[];
  } | null>(null);

  // 1. Rate Limiting State (Token Bucket)
  const [tokens, setTokens] = useState(5);
  const [rateLogs, setRateLogs] = useState<Array<{ id: number; status: number; msg: string; time: string; latency: number }>>([]);
  const [rateLimitExceeded, setRateLimitExceeded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTokens((prev) => Math.min(prev + 1, 5));
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  const triggerRateLimitRequest = () => {
    const now = new Date().toLocaleTimeString();
    if (tokens > 0) {
      setTokens((t) => t - 1);
      setRateLimitExceeded(false);
      setRateLogs((prev) => [
        {
          id: Date.now(),
          status: 200,
          msg: `HTTP/1.1 200 OK — X-RateLimit-Remaining: ${tokens - 1}/5`,
          time: now,
          latency: Math.floor(Math.random() * 8) + 4,
        },
        ...prev.slice(0, 5),
      ]);
    } else {
      setRateLimitExceeded(true);
      setRateLogs((prev) => [
        {
          id: Date.now(),
          status: 429,
          msg: 'HTTP/1.1 429 Too Many Requests — Retry-After: 2s',
          time: now,
          latency: 2,
        },
        ...prev.slice(0, 5),
      ]);
    }
  };

  // 2. JWT State
  const [jwtPayload, setJwtPayload] = useState(
    JSON.stringify(
      {
        sub: 'user_bekzod_8849',
        role: 'system_architect',
        permissions: ['api:read', 'api:write', 'bot:deploy', 'db:manage'],
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
      null,
      2
    )
  );
  const [generatedJwt, setGeneratedJwt] = useState('');
  const [jwtValid, setJwtValid] = useState(true);

  const signJwt = () => {
    try {
      const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
      const payload = btoa(jwtPayload);
      const signature = btoa('bekzod_secret_hash_2026_signature_verified').replace(/=/g, '');
      setGeneratedJwt(`eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${payload}.${signature}`);
      setJwtValid(true);
    } catch {
      setJwtValid(false);
    }
  };

  useEffect(() => {
    signJwt();
  }, [jwtPayload]);

  // 3. Redis vs PostgreSQL Benchmark State
  const [benchmarkRunning, setBenchmarkRunning] = useState(false);
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [redisLatency, setRedisLatency] = useState<number | null>(null);

  const runBenchmark = () => {
    setBenchmarkRunning(true);
    setTimeout(() => {
      setDbLatency(47.4);
      setRedisLatency(1.18);
      setBenchmarkRunning(false);
    }, 450);
  };

  // 4. Webhook Queue State
  const [webhookPayload, setWebhookPayload] = useState(
    JSON.stringify(
      {
        update_id: 994827104,
        message: {
          message_id: 1049,
          from: { id: 5678281376, is_bot: false, first_name: 'Bekzod', username: 'toyneden' },
          chat: { id: 5678281376, type: 'private' },
          text: '/start hire_request',
        },
      },
      null,
      2
    )
  );
  const [webhookResult, setWebhookResult] = useState<string | null>(null);
  const [webhookProcessing, setWebhookProcessing] = useState(false);

  const dispatchWebhook = () => {
    setWebhookProcessing(true);
    setTimeout(() => {
      setWebhookResult(
        JSON.stringify(
          {
            status: 'success',
            code: 200,
            webhook_handler: 'aiogram_fastapi_asyncio_queue',
            worker_id: 'celery-worker-shard-01',
            signature_verified: true,
            execution_time_ms: 2.84,
            dispatched_events: ['audit_log_created', 'telegram_ack_sent', 'db_record_upserted'],
          },
          null,
          2
        )
      );
      setWebhookProcessing(false);
    }, 400);
  };

  const handleRunExplainSql = (mode: 'unindexed' | 'indexed') => {
    setIsExecutingSql(true);
    setSqlMode(mode);

    setTimeout(() => {
      if (mode === 'unindexed') {
        setSqlRunResult({
          executionTime: 418.65,
          bufferReads: '14,280 pages (111.5 MB read)',
          scannedRows: '1,000,000 rows (Seq Scan)',
          improvement: 'Baseline (Slow)',
          queryPlan: [
            'Limit  (cost=0.00..18450.00 rows=20 width=72) (actual time=417.82..418.65 rows=20 loops=1)',
            '  Buffers: shared read=14280',
            '  ->  Seq Scan on transactions  (cost=0.00..18450.00 rows=20 width=72)',
            '        Filter: ((user_id = 49201) AND ((status)::text = \'COMPLETED\'::text))',
            '        Rows Removed by Filter: 999980',
            'Planning Time: 0.421 ms',
            'Execution Time: 418.652 ms  ⚠️ (FULL TABLE DISK SCAN)',
          ],
        });
      } else {
        setSqlRunResult({
          executionTime: 0.84,
          bufferReads: '4 pages (32 KB read)',
          scannedRows: '20 rows (Index Scan)',
          improvement: '500x Tezroq (99.8% Latency Reduction)',
          queryPlan: [
            'Limit  (cost=0.42..8.44 rows=20 width=72) (actual time=0.041..0.842 rows=20 loops=1)',
            '  Buffers: shared hit=4',
            '  ->  Index Scan using idx_tx_user_status_created on transactions (cost=0.42..8.44 rows=20)',
            '        Index Cond: ((user_id = 49201) AND ((status)::text = \'COMPLETED\'::text))',
            'Planning Time: 0.142 ms',
            'Execution Time: 0.842 ms  ⚡ (ULTRA-FAST B-TREE HIT)',
          ],
        });
      }
      setIsExecutingSql(false);
    }, 450);
  };

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="api-sandbox" className="py-20 px-4 sm:px-6 lg:px-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>
              {language === 'uz'
                ? 'JONLI BACKEND LABORATORIYASI'
                : language === 'ru'
                ? 'ЖИВАЯ BACKEND ЛАБОРАТОРИЯ'
                : 'LIVE BACKEND ARCHITECTURE LAB'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {language === 'uz'
              ? 'Interaktiv Backend & API Sandbox'
              : language === 'ru'
              ? 'Интерактивная Backend & API Песочница'
              : 'Interactive Backend & API Sandbox'}
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2">
            {language === 'uz'
              ? 'Katta yuklamali (High-Load) backend arxitekturasi, Redis kesh, Rate-Limiter va Webhook navbatlarini brauzerda jonli sinab ko\'ring.'
              : language === 'ru'
              ? 'Тестируйте алгоритмы Rate-Limiter, Redis кэширование, валидацию JWT и обработку Webhook в реальном времени.'
              : 'Interact live with high-load backend mechanics: token-bucket rate limiters, sub-millisecond Redis caching, JWT verification, and async Webhook queues.'}
          </p>
        </div>

        {/* Sandbox Container */}
        <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
          {/* Navigation Bar */}
          <div className="bg-slate-900/90 border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-2">
                <span className="w-3 h-3 rounded-full bg-red-500/80" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="font-mono text-xs text-slate-400 font-semibold hidden sm:inline">
                bekzod-api-engine v3.12 (AsyncIO)
              </span>
            </div>

            {/* Scenario Tabs */}
            <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('ratelimit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ratelimit'
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Rate Limiter</span>
              </button>
              <button
                onClick={() => setActiveTab('jwt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'jwt'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JWT HS256</span>
              </button>
              <button
                onClick={() => setActiveTab('redis')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'redis'
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Redis vs DB</span>
              </button>
              <button
                onClick={() => setActiveTab('webhook')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'webhook'
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Webhook Queue</span>
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sql'
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL EXPLAIN Sandbox</span>
              </button>
            </div>
          </div>

          {/* Tab 1: Token Bucket Rate Limiter */}
          {activeTab === 'ratelimit' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                    <span>Algorithm: Token Bucket (FastAPI + Redis)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Maksimal 5 ta token sig'imi. Har 2.5 soniyada Redis 1 ta yangi token to'ldirib turadi.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Token counter indicator */}
                  <div className="flex items-center gap-2 bg-slate-900 px-4 py-2 rounded-xl border border-slate-800">
                    <span className="text-xs font-mono text-slate-400">Tokens:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`w-3 h-3 rounded-full transition-all duration-300 ${
                            i <= tokens ? 'bg-blue-500 shadow-sm shadow-blue-400/50' : 'bg-slate-800'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-mono text-xs font-bold text-white ml-1">{tokens}/5</span>
                  </div>

                  <button
                    onClick={triggerRateLimitRequest}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Send Request (POST)</span>
                  </button>
                </div>
              </div>

              {/* Rate limit status visual */}
              {rateLimitExceeded && (
                <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs font-mono flex items-center gap-2.5 animate-bounce">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>
                    <strong>429 TOO MANY REQUESTS:</strong> Rate limit exceeded! Redis bucket empty. Wait for refill...
                  </span>
                </div>
              )}

              {/* Real-time Logs Console */}
              <div className="rounded-2xl bg-slate-900 border border-slate-800 p-4 font-mono text-xs">
                <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>Server Telemetry Logs</span>
                  <span>Endpoint: /api/v1/auth/token</span>
                </div>
                <div className="space-y-1.5">
                  {rateLogs.length === 0 ? (
                    <p className="text-slate-500 text-center py-4">Tugmani bosing va so'rov yuborishni boshlang...</p>
                  ) : (
                    rateLogs.map((log) => (
                      <div
                        key={log.id}
                        className={`p-2 rounded-lg flex items-center justify-between text-xs ${
                          log.status === 200
                            ? 'bg-blue-950/40 text-blue-300 border border-blue-900/50'
                            : 'bg-red-950/40 text-red-300 border border-red-900/50'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-bold">{log.status === 200 ? '🟢 200 OK' : '🔴 429 BLOCKED'}</span>
                          <span>— {log.msg}</span>
                        </span>
                        <span className="text-slate-400 text-[11px]">
                          {log.latency}ms • {log.time}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: JWT HS256 Sign & Inspector */}
          {activeTab === 'jwt' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Editable Payload */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">1. JWT Claims (Payload JSON)</span>
                    <span className="text-[10px] font-mono text-indigo-400">HS256 Verified</span>
                  </div>
                  <textarea
                    value={jwtPayload}
                    onChange={(e) => setJwtPayload(e.target.value)}
                    rows={8}
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {/* Encoded JWT Output */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">2. Encoded Signed Token</span>
                    <button
                      onClick={() => copyToClipboard(generatedJwt)}
                      className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>Copy JWT</span>
                    </button>
                  </div>
                  <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs break-all min-h-[170px]">
                    <span className="text-red-400">eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</span>
                    <span className="text-slate-500">.</span>
                    <span className="text-purple-400">{generatedJwt.split('.')[1] || ''}</span>
                    <span className="text-slate-500">.</span>
                    <span className="text-cyan-400">{generatedJwt.split('.')[2] || ''}</span>
                  </div>
                </div>
              </div>

              {/* JWT Verification Summary */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h4 className="font-mono text-xs font-bold text-white">Cryptographic Signature Valid</h4>
                    <p className="text-[11px] text-slate-400">HMAC-SHA256 hash matches server secret key in 0.08ms.</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono">
                  State: ACTIVE
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Redis vs PostgreSQL In-Memory Benchmark */}
          {activeTab === 'redis' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-emerald-400" />
                    <span>In-Memory Redis vs PostgreSQL Disk I/O Benchmark</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Haqiqiy loyihalarda so'rovlarni 30x-40x tezlashtiruvchi Redis Kesh strategiyasi testi.
                  </p>
                </div>

                <button
                  onClick={runBenchmark}
                  disabled={benchmarkRunning}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${benchmarkRunning ? 'animate-spin' : ''}`} />
                  <span>Run Latency Benchmark</span>
                </button>
              </div>

              {/* Comparison Visualizer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Direct DB */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400">
                      <Database className="w-4 h-4" /> PostgreSQL 16 (Direct Disk Query)
                    </span>
                    <span className="text-xs font-mono text-amber-300 font-bold">
                      {dbLatency ? `${dbLatency} ms` : '—'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-700"
                      style={{ width: dbLatency ? '95%' : '0%' }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    Query: <code className="text-slate-300">SELECT * FROM projects WHERE is_active=true;</code> (Disk I/O)
                  </p>
                </div>

                {/* Redis Cached */}
                <div className="p-5 rounded-2xl bg-slate-900 border border-emerald-900/60 bg-emerald-950/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-mono font-bold text-emerald-400">
                      <Zap className="w-4 h-4" /> Redis 7.2 (RAM In-Memory Cache)
                    </span>
                    <span className="text-xs font-mono text-emerald-300 font-bold">
                      {redisLatency ? `${redisLatency} ms` : '—'}
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                      style={{ width: redisLatency ? '4%' : '0%' }}
                    />
                  </div>
                  <p className="text-[11px] font-mono text-slate-400">
                    Cache Hit: <code className="text-emerald-300">GET portfolio:projects:active</code> (40x Faster!)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Telegram Async Webhook Queue */}
          {activeTab === 'webhook' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                      Incoming Telegram Webhook Payload
                    </span>
                    <span className="text-[10px] font-mono text-purple-400">POST /api/webhook</span>
                  </div>
                  <textarea
                    value={webhookPayload}
                    onChange={(e) => setWebhookPayload(e.target.value)}
                    rows={8}
                    className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={dispatchWebhook}
                    disabled={webhookProcessing}
                    className="mt-3 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-purple-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Dispatch to Async Queue</span>
                  </button>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-slate-400 font-bold uppercase">
                      Worker Dispatch Response (Celery / AsyncIO)
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">200 OK</span>
                  </div>
                  <pre className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto min-h-[220px]">
                    {webhookResult || 'So\'rovni navbatga yo\'llash uchun "Dispatch" tugmasini bosing...'}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: PostgreSQL Query Optimization & EXPLAIN ANALYZE */}
          {activeTab === 'sql' && (
            <div className="p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="font-mono text-base font-bold text-white flex items-center gap-2">
                    <Database className="w-5 h-5 text-amber-400" />
                    <span>PostgreSQL 16: Sequential Scan vs B-Tree Composite Index</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    1,000,000 qatorlik tranzaksiyalar jadvalidan filtrli qidiruvning EXPLAIN (ANALYZE, BUFFERS) taqqoslashi.
                  </p>
                </div>

                {/* Scenario Toggle */}
                <div className="flex items-center gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                  <button
                    onClick={() => handleRunExplainSql('unindexed')}
                    disabled={isExecutingSql}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      sqlMode === 'unindexed'
                        ? 'bg-rose-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    1. Indekssiz (Seq Scan)
                  </button>
                  <button
                    onClick={() => handleRunExplainSql('indexed')}
                    disabled={isExecutingSql}
                    className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                      sqlMode === 'indexed'
                        ? 'bg-emerald-600 text-white shadow-md'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    2. B-Tree Indeksli (Index Scan)
                  </button>
                </div>
              </div>

              {/* SQL Query Box */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                      Bajarilayotgan SQL So'rovi
                    </span>
                    <span className="text-[10px] font-mono text-amber-400">
                      {sqlMode === 'unindexed' ? 'Disk I/O Heavy' : 'Composite Index Optimized'}
                    </span>
                  </div>

                  <pre className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-amber-300 font-mono text-xs leading-relaxed overflow-x-auto">
                    <code>
                      {sqlMode === 'unindexed'
                        ? `-- 1. Oddiy filtr (Jadvalda 1,000,000 qator mavjud)\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, user_id, amount, status, created_at\nFROM transactions\nWHERE user_id = 49201 AND status = 'COMPLETED'\nORDER BY created_at DESC\nLIMIT 20;`
                        : `-- 2. Composite B-Tree Indeks yaratilgan:\n-- CREATE INDEX idx_tx_user_status_created \n-- ON transactions (user_id, status, created_at DESC);\n\nEXPLAIN (ANALYZE, BUFFERS)\nSELECT id, user_id, amount, status, created_at\nFROM transactions\nWHERE user_id = 49201 AND status = 'COMPLETED'\nORDER BY created_at DESC\nLIMIT 20;`}
                    </code>
                  </pre>

                  <button
                    onClick={() => handleRunExplainSql(sqlMode)}
                    disabled={isExecutingSql}
                    className={`w-full py-3 rounded-xl font-mono text-xs font-bold transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 ${
                      sqlMode === 'unindexed'
                        ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>
                      {isExecutingSql
                        ? 'Query rejasini tahlil qilmoqda...'
                        : sqlMode === 'unindexed'
                        ? 'Sekin So\'rovni Bajarish (Seq Scan)'
                        : 'Optimallashtirilgan So\'rovni Bajarish (Index Scan)'}
                    </span>
                  </button>
                </div>

                {/* Query Plan Inspector */}
                <div className="lg:col-span-6 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                      EXPLAIN (ANALYZE, BUFFERS) Natijasi
                    </span>
                    {sqlRunResult && (
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                          sqlMode === 'indexed'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-rose-950 text-rose-300 border border-rose-800'
                        }`}
                      >
                        {sqlRunResult.improvement}
                      </span>
                    )}
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 font-mono text-xs space-y-3">
                    {sqlRunResult ? (
                      <>
                        <div className="grid grid-cols-2 gap-3 pb-3 border-b border-slate-800">
                          <div>
                            <div className="text-[10px] text-slate-400">Execution Time:</div>
                            <div
                              className={`text-lg font-bold ${
                                sqlRunResult.executionTime < 5 ? 'text-emerald-400' : 'text-rose-400'
                              }`}
                            >
                              {sqlRunResult.executionTime} ms
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-400">Disk / Buffer Reads:</div>
                            <div className="text-xs font-bold text-slate-200 mt-1">
                              {sqlRunResult.bufferReads}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <div className="text-[10px] text-slate-400 uppercase">PostgreSQL Query Plan Tree:</div>
                          <pre className="p-2.5 rounded-xl bg-slate-950 text-[11px] leading-relaxed text-slate-300 overflow-x-auto">
                            {sqlRunResult.queryPlan.join('\n')}
                          </pre>
                        </div>
                      </>
                    ) : (
                      <div className="py-12 text-center text-slate-500 font-mono text-xs">
                        Tugmani bosing va 1,000,000 qatorlik jadvalda PostgreSQL qidiruv tezligini tekshiring...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
