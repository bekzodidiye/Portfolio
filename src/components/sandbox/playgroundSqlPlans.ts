export interface SqlExplainResult {
  executionTime: number;
  bufferReads: string;
  scannedRows: string;
  improvement: string;
  queryPlan: string[];
}

export const UNINDEXED_SQL_PLAN: SqlExplainResult = {
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
};

export const INDEXED_SQL_PLAN: SqlExplainResult = {
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
};
