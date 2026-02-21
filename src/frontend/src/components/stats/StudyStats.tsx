import { useGetAllSessions, useGetSessionsByTag } from '../../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Clock, TrendingUp, Calendar, Award, Download, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { TimerSession } from '../../backend';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllTags, useExportData } from '../../hooks/useQueries';
import { toast } from 'sonner';

export default function StudyStats() {
  const { data: allSessions = [], isLoading } = useGetAllSessions();
  const { data: tags = [] } = useGetAllTags();
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const getSessionsByTagMutation = useGetSessionsByTag();
  const { exportSessions } = useExportData();

  const sessions = selectedTag && getSessionsByTagMutation.data 
    ? getSessionsByTagMutation.data 
    : allSessions;

  const stats = useMemo(() => {
    const now = Date.now();
    const oneDayAgo = now - 24 * 60 * 60 * 1000;
    const oneWeekAgo = now - 7 * 24 * 60 * 60 * 1000;
    const oneMonthAgo = now - 30 * 24 * 60 * 60 * 1000;
    const oneYearAgo = now - 365 * 24 * 60 * 60 * 1000;

    const dailySessions = sessions.filter((s) => Number(s.startTime) / 1_000_000 >= oneDayAgo);
    const weeklySessions = sessions.filter((s) => Number(s.startTime) / 1_000_000 >= oneWeekAgo);
    const monthlySessions = sessions.filter((s) => Number(s.startTime) / 1_000_000 >= oneMonthAgo);
    const yearlySessions = sessions.filter((s) => Number(s.startTime) / 1_000_000 >= oneYearAgo);

    const sumHours = (sessionList: TimerSession[]) =>
      sessionList.reduce((acc, s) => acc + Number(s.duration) / 1_000_000_000 / 3600, 0);

    return {
      daily: sumHours(dailySessions),
      weekly: sumHours(weeklySessions),
      monthly: sumHours(monthlySessions),
      yearly: sumHours(yearlySessions),
      totalSessions: sessions.length,
    };
  }, [sessions]);

  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const daySessions = sessions.filter((s) => {
        const sessionTime = Number(s.startTime) / 1_000_000;
        return sessionTime >= date.getTime() && sessionTime < nextDay.getTime();
      });

      const hours = daySessions.reduce(
        (acc, s) => acc + Number(s.duration) / 1_000_000_000 / 3600,
        0
      );

      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: parseFloat(hours.toFixed(2)),
      };
    });
  }, [sessions]);

  const handleExport = async () => {
    try {
      const data = await exportSessions();
      const csv = convertToCSV(data);
      downloadFile(csv, 'study-sessions.csv', 'text/csv');
      toast.success('Sessions exported successfully!');
    } catch (error) {
      toast.error('Failed to export sessions');
    }
  };

  const convertToCSV = (data: TimerSession[]) => {
    const headers = ['Start Time', 'End Time', 'Duration (hours)', 'Label', 'Color', 'Tags'];
    const rows = data.map((session) => [
      new Date(Number(session.startTime) / 1_000_000).toISOString(),
      new Date(Number(session.endTime) / 1_000_000).toISOString(),
      (Number(session.duration) / 1_000_000_000 / 3600).toFixed(2),
      session.labelText,
      session.colorTheme,
      session.tags.join('; '),
    ]);
    return [headers, ...rows].map((row) => row.join(',')).join('\n');
  };

  const downloadFile = (content: string, filename: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleTagFilter = async (tag: string) => {
    if (tag === 'all') {
      setSelectedTag(null);
    } else {
      setSelectedTag(tag);
      await getSessionsByTagMutation.mutateAsync(tag);
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white">Study Statistics</h3>
        <p className="text-sm text-white/70">Loading your study data...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-white">
            <TrendingUp className="h-5 w-5" />
            Study Statistics
          </h3>
          <p className="text-sm text-white/70">Track your study progress over time</p>
        </div>
        <div className="flex gap-2">
          {tags.length > 0 && (
            <Select value={selectedTag || 'all'} onValueChange={handleTagFilter}>
              <SelectTrigger className="w-[150px] text-white">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all" className="text-white">All Tags</SelectItem>
                {tags.map((tag) => (
                  <SelectItem key={tag} value={tag} className="text-white">
                    {tag}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExport}
            className="text-white hover:text-white/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>
      <div>
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="data-[state=active]:text-white text-white/70">Overview</TabsTrigger>
            <TabsTrigger value="chart" className="data-[state=active]:text-white text-white/70">Chart</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4" />
                  <span className="text-xs font-medium">Today</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.daily.toFixed(1)}h</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Calendar className="h-4 w-4" />
                  <span className="text-xs font-medium">This Week</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.weekly.toFixed(1)}h</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-medium">This Month</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.monthly.toFixed(1)}h</p>
              </div>

              <div className="space-y-2 p-4 rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Award className="h-4 w-4" />
                  <span className="text-xs font-medium">This Year</span>
                </div>
                <p className="text-2xl font-bold text-white">{stats.yearly.toFixed(1)}h</p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <p className="text-sm text-white/70">
                Total Sessions: <span className="font-medium text-white">{stats.totalSessions}</span>
                {selectedTag && <span className="ml-2 text-xs">(filtered by: {selectedTag})</span>}
              </p>
            </div>
          </TabsContent>

          <TabsContent value="chart">
            <div className="h-64 rounded-lg p-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="date" fontSize={12} stroke="rgba(255,255,255,0.7)" />
                  <YAxis fontSize={12} stroke="rgba(255,255,255,0.7)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: 'none',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="hours" fill="rgba(255,255,255,0.3)" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
