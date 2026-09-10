import { useState, useEffect } from 'react';
import {
  getRealVisitorRecords,
  getRealAnalyticsSummary,
  clearRealVisitorRecords,
  fetchRealVisitorStatsFromPostgres,
  RealVisitorRecord,
  RealAnalyticsSummary,
} from '../../services/realVisitorStorage';

export function useAdminAnalytics(isAdminOpen: boolean, isAdminAuthenticated: boolean) {
  const [realLogs, setRealLogs] = useState<RealVisitorRecord[]>([]);
  const [realSummary, setRealSummary] = useState<RealAnalyticsSummary>({
    totalVisitors: 0,
    todayVisitors: 0,
    mobilePercent: 0,
    desktopPercent: 0,
    topLocations: [],
  });

  const refreshAnalyticsData = async () => {
    const localRecords = getRealVisitorRecords();
    const localSummary = getRealAnalyticsSummary();
    setRealLogs(localRecords);
    setRealSummary(localSummary);

    const pgData = await fetchRealVisitorStatsFromPostgres();
    if (pgData && pgData.records.length > 0) {
      setRealLogs(pgData.records);
      setRealSummary({
        totalVisitors: pgData.totalVisitors,
        todayVisitors: pgData.todayVisitors,
        mobilePercent: pgData.mobilePercent,
        desktopPercent: pgData.desktopPercent,
        topLocations: pgData.topLocations,
      });
    }
  };

  useEffect(() => {
    if (isAdminOpen && isAdminAuthenticated) {
      refreshAnalyticsData();
    }
  }, [isAdminOpen, isAdminAuthenticated]);

  const clearLogs = () => {
    clearRealVisitorRecords();
    refreshAnalyticsData();
  };

  return {
    realLogs,
    realSummary,
    refreshAnalyticsData,
    clearLogs,
  };
}
