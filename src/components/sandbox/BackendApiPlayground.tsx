import React from 'react';
import { Cpu } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { useBackendPlayground } from './useBackendPlayground';
import { BackendPlaygroundNav } from './BackendPlaygroundNav';
import { RateLimiterScenario } from './components/RateLimiterScenario';
import { JwtScenario } from './components/JwtScenario';
import { RedisBenchmarkScenario } from './components/RedisBenchmarkScenario';
import { WebhookQueueScenario } from './components/WebhookQueueScenario';
import { SqlExplainScenario } from './components/SqlExplainScenario';
import { ErrorBoundary } from '../common/ErrorBoundary';

export const BackendApiPlayground: React.FC = () => {
  const { language } = useLanguage();
  const {
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
  } = useBackendPlayground();

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

        <ErrorBoundary>
          <div className="rounded-3xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden text-slate-200">
            <BackendPlaygroundNav activeTab={activeTab} setActiveTab={setActiveTab} />

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
        </ErrorBoundary>
      </div>
    </section>
  );
};
