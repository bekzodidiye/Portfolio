import React from 'react';
import { Play } from 'lucide-react';

interface WebhookQueueScenarioProps {
  webhookPayload: string;
  webhookProcessing: boolean;
  webhookResult: string;
  onPayloadChange: (val: string) => void;
  onDispatchWebhook: () => void;
}

export const WebhookQueueScenario: React.FC<WebhookQueueScenarioProps> = ({
  webhookPayload,
  webhookProcessing,
  webhookResult,
  onPayloadChange,
  onDispatchWebhook,
}) => {
  return (
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
            onChange={(e) => onPayloadChange(e.target.value)}
            rows={8}
            className="w-full p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-purple-300 font-mono text-xs focus:outline-none focus:border-purple-500"
          />
          <button
            onClick={onDispatchWebhook}
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
  );
};
