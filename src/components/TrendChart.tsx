import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Clock, Target, Activity } from 'lucide-react';
import { TrendData } from '@/types/test-history';

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  if (data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-strong">
          <p className="font-medium text-foreground mb-2">File #{label}</p>
          <p className="text-sm text-muted-foreground mb-1">{data.fileName}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {typeof entry.value === 'number' ? 
                (entry.dataKey === 'successRate' ? `${entry.value.toFixed(1)}%` :
                 entry.dataKey === 'totalTime' ? `${entry.value.toFixed(1)}s` :
                 entry.value.toLocaleString()) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const successRateData = data.map(d => ({
    runNumber: d.runNumber,
    successRate: d.successRate,
    fileName: d.fileName
  }));

  const executionTimeData = data.map(d => ({
    runNumber: d.runNumber,
    totalTime: d.totalTime,
    fileName: d.fileName
  }));

  const testCountData = data.map(d => ({
    runNumber: d.runNumber,
    total: d.totalTests,
    passed: d.successCount,
    failed: d.failedCount,
    errors: d.errorCount,
    skipped: d.skippedCount,
    fileName: d.fileName
  }));

  return (
    <Card className="shadow-soft border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Cross-File Trend Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="success-rate" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="success-rate" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Success Rate
            </TabsTrigger>
            <TabsTrigger value="execution-time" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Execution Time
            </TabsTrigger>
            <TabsTrigger value="test-counts" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Test Counts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="success-rate" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={successRateData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="runNumber" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[0, 100]}
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="successRate" 
                    stroke="hsl(var(--success))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 4 }}
                    name="Success Rate (%)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="execution-time" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={executionTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="runNumber" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="totalTime" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                    name="Execution Time (s)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="test-counts" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={testCountData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="runNumber" 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Line type="monotone" dataKey="passed" stroke="hsl(var(--success))" strokeWidth={2} name="Passed" />
                  <Line type="monotone" dataKey="failed" stroke="hsl(var(--error))" strokeWidth={2} name="Failed" />
                  <Line type="monotone" dataKey="errors" stroke="hsl(var(--destructive))" strokeWidth={2} name="Errors" />
                  <Line type="monotone" dataKey="skipped" stroke="hsl(var(--warning))" strokeWidth={2} name="Skipped" />
                  <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={3} name="Total" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}