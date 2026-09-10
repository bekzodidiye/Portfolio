import { useState, useEffect } from 'react';
import {
  SqlExplainResult,
  UNINDEXED_SQL_PLAN,
  INDEXED_SQL_PLAN,
} from './playgroundSqlPlans';

export type SandboxTab = 'ratelimit' | 'jwt' | 'redis' | 'webhook' | 'sql';

export function useBackendPlayground() {
  const [activeTab, setActiveTab] = useState<SandboxTab>('ratelimit');
  const [copied, setCopied] = useState(false);

  // 1. Rate Limiting State
  const [tokens, setTokens] = useState(5);
  const [rateLogs, setRateLogs] = useState<
    Array<{ id: number; status: number; msg: string; time: string; latency: number }>
  >([]);
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
  const [jwtPayload, setJwtPayload] = useState(
    '{\n  "sub": "bekzod.dev",\n  "role": "Senior Backend Architect",\n  "iat": 1725048291,\n  "exp": 1725134691\n}'
  );
  const [jwtSecret, setJwtSecret] = useState('super-secret-highload-key-2026');
  const [token, setToken] = useState(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiZWt6b2QuZGV2Iiwicm9sZSI6IlNlbmlvciBCYWNrZW5kIEFyY2hpdGVjdCIsImlhdCI6MTcyNTA0ODI5MSwiZXhwIjoxNzI1MTM0NjkxfQ.f9xW8kK_89q2Jz0P3mN7vL5cQ'
  );
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
  const [webhookPayload, setWebhookPayload] = useState(
    '{\n  "update_id": 9845120,\n  "message": {\n    "message_id": 1042,\n    "from": { "id": 5678281376, "first_name": "Recruiter" },\n    "text": "/hire_senior_engineer"\n  }\n}'
  );
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
  const [sqlRunResult, setSqlRunResult] = useState<SqlExplainResult | null>(null);

  const handleRunExplainSql = (mode: 'unindexed' | 'indexed') => {
    setIsExecutingSql(true);
    setSqlMode(mode);

    setTimeout(() => {
      setSqlRunResult(mode === 'unindexed' ? UNINDEXED_SQL_PLAN : INDEXED_SQL_PLAN);
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

  return {
    activeTab,
    setActiveTab,
    copied,
    tokens,
    rateLogs,
    rateLimitExceeded,
    triggerRateLimitRequest,
    jwtHeader,
    jwtPayload,
    setJwtPayload,
    jwtSecret,
    setJwtSecret,
    token,
    isTokenValid,
    isBenchmarking,
    dbLatency,
    redisLatency,
    runBenchmark,
    webhookPayload,
    setWebhookPayload,
    webhookProcessing,
    webhookResult,
    dispatchWebhook,
    sqlMode,
    isExecutingSql,
    sqlRunResult,
    handleRunExplainSql,
    copyToClipboard,
  };
}
