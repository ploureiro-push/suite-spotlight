import { Clock, CheckCircle, XCircle, AlertTriangle, MinusCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TestResults } from '@/types/test-results';

interface StatsOverviewProps {
  results: TestResults;
}

export function StatsOverview({ results }: StatsOverviewProps) {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60).toFixed(1);
    return minutes > 0 ? `${minutes}m ${remainingSeconds}s` : `${remainingSeconds}s`;
  };

  const getSuccessRate = () => {
    return ((results.success_count / results.total_count) * 100).toFixed(1);
  };

  const stats = [
    {
      title: 'Total Tests',
      value: results.total_count.toLocaleString(),
      icon: CheckCircle,
      color: 'text-info'
    },
    {
      title: 'Success Rate',
      value: `${getSuccessRate()}%`,
      icon: CheckCircle,
      color: 'text-success'
    },
    {
      title: 'Total Time',
      value: formatTime(results.total_time),
      icon: Clock,
      color: 'text-primary'
    },
    {
      title: 'Test Suites',
      value: results.test_suites.length.toString(),
      icon: CheckCircle,
      color: 'text-info'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index} className="shadow-soft border-border/50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              </div>
              <stat.icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="md:col-span-2 lg:col-span-4 shadow-soft border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Test Results Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-success" />
              <Badge variant="secondary" className="bg-success-bg text-success border-success/20">
                {results.success_count.toLocaleString()} Passed
              </Badge>
            </div>
            
            {results.failed_count > 0 && (
              <div className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-error" />
                <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
                  {results.failed_count.toLocaleString()} Failed
                </Badge>
              </div>
            )}
            
            {results.error_count > 0 && (
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-error" />
                <Badge variant="secondary" className="bg-error-bg text-error border-error/20">
                  {results.error_count.toLocaleString()} Errors
                </Badge>
              </div>
            )}
            
            {results.skipped_count > 0 && (
              <div className="flex items-center gap-2">
                <MinusCircle className="h-4 w-4 text-warning" />
                <Badge variant="secondary" className="bg-warning-bg text-warning border-warning/20">
                  {results.skipped_count.toLocaleString()} Skipped
                </Badge>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}