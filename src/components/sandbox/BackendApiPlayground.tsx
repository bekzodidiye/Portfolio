import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Zap,
  Layers,
  Database,
  Cpu,
  Code2,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { RateLimiterScenario } from './components/RateLimiterScenario';
import { JwtScenario } from './components/JwtScenario';
import { RedisBenchmarkScenario } from './components/RedisBenchmarkScenario';
import { WebhookQueueScenario } from './components/WebhookQueueScenario';
import { SqlExplainScenario } from './components/SqlExplainScenario';

type SandboxTab = 'ratelimit' | 'jwt' | 'redis' | 'webhook' | 'sql';

export const BackendApiPlayground: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<SandboxTab>('ratelimit');
  const [copied, setCopied] = useState(false);

  // 1. Rate Limiting State
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
  const [jwtHeader] = useState('{\n  "alg": "HS256",\n  "typ": "JWT"\n}');
  const [jwtPayload, setJwtPayload] = useState('{\n  "sub": "bekzod.dev",\n  "role": "Senior Backend Architect",\n  "iat": 1725048291,\n  "exp": 1725134691\n}');
  const [jwtSecret, setJwtSecret] = useState('super-secret-highload-key-2026');
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZWt6b2QuZGV2Iiwicm9sZSI6IlNlbmlvciBCYWNrZW5kIEFyY2hpdGVjdCIsImlhdCI6MTcyNTA0ODI5MSwiZXhwIjoxNzI1MTM0NjkxfQ.f9xW8kK_89q2Jz0P3mN7vL5cQ');
  const [isTokenValid, setIsTokenValid] = useState(true);

  useEffect(() => {
    try {
      const b64H = btoa(jwtHeader).replace(/=/g, '');
      const b64P = btoa(jwtPayload).replace(/=/g, '');
      const pseudoSig = btoa(`${b64H}.${b64P}.${jwtSecret}`).slice(0, 24).replace(/=/g, '');
      setToken(`${b64H}.${b64P}.${pseudoSig}`);
      setIsTokenValid(jwtSecret.length >= 8);
    } catch {
      setIsTokenValid(false);
    }
  }, [jwtHeader, jwtPayload, jwtSecret]);

  // 3. Redis Benchmark State
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [dbLatency, setDbLatency] = useState<number | null>(null);
  const [redisLatency, setRedisLatency] = useState<number | null>(null);

  const runBenchmark = () => {
    setIsBenchmarking(true);
    setDbLatency(null);
    setRedisLatency(null);

    setTimeout(() => {
      setDbLatency(Math.floor(Math.random() * 15) + 38);
      setRedisLatency(Number((Math.random() * 0.6 + 0.8).toFixed(2)));
      setIsBenchmarking(false);
    }, 600);
  };

  // 4. Webhook State
  const [webhookPayload, setWebhookPayload] = useState('{\n  "update_id": 9845120,\n  "message": {\n    "message_id": 1042,\n    "from": { "id": 5678281376, "first_name": "Recruiter" },\n    "text": "/hire_senior_engineer"\n  }\n}');
  const [webhookProcessing, setWebhookProcessing] = useState(false);
  const [webhookResult, setWebhookResult] = useState<string | null>(null);

  const dispatchWebhook = () => {
    setWebhookProcessing(true);
    setWebhookResult(null);

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

  // 5. SQL Optimizer State
  const [sqlMode, setSqlMode] = useState<'unindexed' | 'indexed'>('unindexed');
  const [isExecutingSql, setIsExecutingSql] = useState(false);
  const [sqlRunResult, setSqlRunResult] = useState<{
    executionTime: number;
    bufferReads: string;
    scannedRows: string;
    improvement: string;
    queryPlan: string[];
  } | null>(null);

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
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-mono mb-3">
            <Cpu className="w-3.5 h-3.5" />
            <span>{language === 'uz' ? 'JONLI BACKEND LABORATORIYASI' : 'LIVE BACKEND ARCHITECTURE LAB'}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900">
            {language === 'uz' ? 'Interaktiv Backend & API Sandbox' : 'Interactive Backend & API Sandbox'}
          </h2>
          <p className="text-slate-600 text-sm max-w-2xl mx-auto mt-2">
            {language === 'uz'
              ? 'Katta yuklamali backend arxitekturasi, Redis kesh, Rate-Limiter va SQL rejalarini brauzerda jonli sinab ko\'ring.'
              : 'Interact live with high-load backend mechanics: rate limiters, Redis caching, JWT verification, and SQL plans.'}
          </p>
        </div>

        <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
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

            <div className="flex flex-wrap items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setActiveTab('ratelimit')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'ratelimit' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Rate Limiter</span>
              </button>
              <button
                onClick={() => setActiveTab('jwt')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'jwt' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>JWT HS256</span>
              </button>
              <button
                onClick={() => setActiveTab('redis')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'redis' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Redis vs DB</span>
              </button>
              <button
                onClick={() => setActiveTab('webhook')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'webhook' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Webhook Queue</span>
              </button>
              <button
                onClick={() => setActiveTab('sql')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'sql' ? 'bg-amber-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Database className="w-3.5 h-3.5" />
                <span>SQL EXPLAIN Sandbox</span>
              </button>
            </div>
          </div>

          {activeTab === 'ratelimit' && (
            <RateLimiterScenario
              tokens={tokens}
              rateLimitExceeded={rateLimitExceeded}
              rateLogs={rateLogs}
              onTriggerRequest={triggerRateLimitRequest}
            />
          )}

          {activeTab === 'jwt' && (
            <JwtScenario
              jwtHeader={jwtHeader}
              jwtPayload={jwtPayload}
              jwtSecret={jwtSecret}
              token={token}
              isTokenValid={isTokenValid}
              copied={copied}
              onPayloadChange={setJwtPayload}
              onSecretChange={setJwtSecret}
              onCopy={copyToClipboard}
            />
          )}

          {activeTab === 'redis' && (
            <RedisBenchmarkScenario
              isBenchmarking={isBenchmarking}
              dbLatency={dbLatency}
              redisLatency={redisLatency}
              onRunBenchmark={runBenchmark}
            />
          )}

          {activeTab === 'webhook' && (
            <WebhookQueueScenario
              webhookPayload={webhookPayload}
              webhookProcessing={webhookProcessing}
              webhookResult={webhookResult || ''}
              onPayloadChange={setWebhookPayload}
              onDispatchWebhook={dispatchWebhook}
            />
          )}

          {activeTab === 'sql' && (
            <SqlExplainScenario
              sqlMode={sqlMode}
              isExecutingSql={isExecutingSql}
              sqlRunResult={sqlRunResult}
              onRunSql={handleRunExplainSql}
            />
          )}
        </div>
      </div>
    </section>
  );
};
