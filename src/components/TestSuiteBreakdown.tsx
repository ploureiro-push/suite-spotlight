import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TestRun } from '@/types/test-history';
import { TestTube } from 'lucide-react';

interface TestSuiteBreakdownProps {
  testRuns: TestRun[];
}

export function TestSuiteBreakdown({ testRuns }: TestSuiteBreakdownProps) {
  // Sort test runs by run number to ensure proper chronological order
  const sortedRuns = [...testRuns].sort((a, b) => a.runNumber - b.runNumber);
  
  // Get all unique test suite names across all runs
  const allSuiteNames = new Set<string>();
  sortedRuns.forEach(run => {
    run.results.test_suites.forEach(suite => {
      allSuiteNames.add(suite.name);
    });
  });

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
                (entry.dataKey.includes('Rate') ? `${entry.value.toFixed(1)}%` :
                 entry.dataKey.includes('Time') ? `${entry.value.toFixed(1)}s` :
                 entry.value.toLocaleString()) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Create comparison data for each suite across all runs
  const suiteTrendData = Array.from(allSuiteNames).map(suiteName => {
    const data = sortedRuns.map(run => {
      const suite = run.results.test_suites.find(s => s.name === suiteName);
      return {
        runNumber: run.runNumber,
        fileName: run.fileName,
        successRate: suite ? (suite.success_count / suite.total_count) * 100 : 0,
        totalTime: suite ? suite.total_time : 0,
        testCount: suite ? suite.total_count : 0,
        exists: !!suite
      };
    });

    return { suiteName, data };
  });

  const colors = [
    'hsl(var(--primary))',
    'hsl(var(--success))',
    'hsl(var(--warning))',
    'hsl(var(--error))',
    'hsl(var(--info))',
    'hsl(220, 70%, 50%)',
    'hsl(280, 70%, 50%)',
    'hsl(320, 70%, 50%)',
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <TestTube className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Test Suite Evolution Across Files</h2>
      </div>
      
      {suiteTrendData.map((suiteData, index) => (
        <Card key={suiteData.suiteName} className="shadow-soft border-border/50">
          <CardHeader>
            <CardTitle className="text-lg">{suiteData.suiteName}</CardTitle>
            <p className="text-sm text-muted-foreground">
              Comparing across {suiteData.data.filter(d => d.exists).length} files
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Success Rate Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">Success Rate Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={suiteData.data.filter(d => d.exists)}>
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
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
                        name="Success Rate (%)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Execution Time Chart */}
              <div>
                <h4 className="text-sm font-medium mb-3">Execution Time Trend</h4>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={suiteData.data.filter(d => d.exists)}>
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
                        stroke={colors[index % colors.length]}
                        strokeWidth={2}
                        dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 3 }}
                        name="Execution Time (s)"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}