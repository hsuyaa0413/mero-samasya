'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface EngagementData {
  month: string;
  infrastructure: { submissions: number; interactions: number };
  environment: { submissions: number; interactions: number };
  governance: { submissions: number; interactions: number };
  publicSafety: { submissions: number; interactions: number };
  transportation: { submissions: number; interactions: number };
}

// Generate realistic engagement data
function generateEngagementData(): EngagementData[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];

  return months.map(month => {
    // Simulate seasonal trends
    const winterBoost = month === 'Jan' || month === 'Feb' ? 1.3 : 1;
    const springBoost = month === 'Mar' || month === 'Apr' ? 1.2 : 1;

    return {
      month,
      infrastructure: {
        submissions: Math.floor((45 + Math.random() * 20) * winterBoost),
        interactions: Math.floor((180 + Math.random() * 60) * winterBoost),
      },
      environment: {
        submissions: Math.floor((35 + Math.random() * 15) * springBoost),
        interactions: Math.floor((140 + Math.random() * 40) * springBoost),
      },
      governance: {
        submissions: Math.floor(25 + Math.random() * 10),
        interactions: Math.floor(100 + Math.random() * 30),
      },
      publicSafety: {
        submissions: Math.floor(30 + Math.random() * 12),
        interactions: Math.floor(120 + Math.random() * 35),
      },
      transportation: {
        submissions: Math.floor(20 + Math.random() * 8),
        interactions: Math.floor(80 + Math.random() * 25),
      },
    };
  });
}

export function EngagementByIssueType() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const data = generateEngagementData();
    const months = data.map(d => d.month);

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: months,
        datasets: [
          // Submissions datasets
          {
            label: 'Infrastructure Submissions',
            data: data.map(d => d.infrastructure.submissions),
            backgroundColor: '#6366f1',
            stack: 'submissions',
          },
          {
            label: 'Environment Submissions',
            data: data.map(d => d.environment.submissions),
            backgroundColor: '#10b981',
            stack: 'submissions',
          },
          {
            label: 'Governance Submissions',
            data: data.map(d => d.governance.submissions),
            backgroundColor: '#f59e0b',
            stack: 'submissions',
          },
          {
            label: 'Public Safety Submissions',
            data: data.map(d => d.publicSafety.submissions),
            backgroundColor: '#ef4444',
            stack: 'submissions',
          },
          {
            label: 'Transportation Submissions',
            data: data.map(d => d.transportation.submissions),
            backgroundColor: '#8b5cf6',
            stack: 'submissions',
          },
          // Interactions datasets
          {
            label: 'Infrastructure Interactions',
            data: data.map(d => d.infrastructure.interactions),
            backgroundColor: '#6366f1',
            stack: 'interactions',
            borderWidth: 2,
            borderColor: '#4f46e5',
          },
          {
            label: 'Environment Interactions',
            data: data.map(d => d.environment.interactions),
            backgroundColor: '#10b981',
            stack: 'interactions',
            borderWidth: 2,
            borderColor: '#059669',
          },
          {
            label: 'Governance Interactions',
            data: data.map(d => d.governance.interactions),
            backgroundColor: '#f59e0b',
            stack: 'interactions',
            borderWidth: 2,
            borderColor: '#d97706',
          },
          {
            label: 'Public Safety Interactions',
            data: data.map(d => d.publicSafety.interactions),
            backgroundColor: '#ef4444',
            stack: 'interactions',
            borderWidth: 2,
            borderColor: '#dc2626',
          },
          {
            label: 'Transportation Interactions',
            data: data.map(d => d.transportation.interactions),
            backgroundColor: '#8b5cf6',
            stack: 'interactions',
            borderWidth: 2,
            borderColor: '#7c3aed',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            grid: {
              display: false,
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            grid: {
              color: 'rgba(0, 0, 0, 0.05)',
            },
            ticks: {
              callback: value => value + '',
            },
          },
        },
        plugins: {
          legend: {
            display: false, // We'll create a custom legend
            position: 'right',
          },
          tooltip: {
            callbacks: {
              title: context =>
                `${context[0].label} - ${
                  context[0].dataset.label?.includes('Submissions')
                    ? 'New Submissions'
                    : 'Total Interactions'
                }`,
              label: context => {
                const category = context.dataset.label?.split(' ')[0] || '';
                const type = context.dataset.label?.includes('Submissions')
                  ? 'submissions'
                  : 'interactions';
                return `${category}: ${context.parsed.y} ${type}`;
              },
            },
          },
        },
      },
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, []);

  const data = generateEngagementData();

  // Calculate totals for insights
  const totalsByCategory = {
    infrastructure: data.reduce(
      (sum, d) =>
        sum + d.infrastructure.submissions + d.infrastructure.interactions,
      0
    ),
    environment: data.reduce(
      (sum, d) => sum + d.environment.submissions + d.environment.interactions,
      0
    ),
    governance: data.reduce(
      (sum, d) => sum + d.governance.submissions + d.governance.interactions,
      0
    ),
    publicSafety: data.reduce(
      (sum, d) =>
        sum + d.publicSafety.submissions + d.publicSafety.interactions,
      0
    ),
    transportation: data.reduce(
      (sum, d) =>
        sum + d.transportation.submissions + d.transportation.interactions,
      0
    ),
  };

  const topCategory = Object.entries(totalsByCategory).reduce((a, b) =>
    totalsByCategory[a[0] as keyof typeof totalsByCategory] >
    totalsByCategory[b[0] as keyof typeof totalsByCategory]
      ? a
      : b
  )[0];

  const categories = [
    { name: 'Infrastructure', color: '#6366f1', key: 'infrastructure' },
    { name: 'Environment', color: '#10b981', key: 'environment' },
    { name: 'Governance', color: '#f59e0b', key: 'governance' },
    { name: 'Public Safety', color: '#ef4444', key: 'publicSafety' },
    { name: 'Transportation', color: '#8b5cf6', key: 'transportation' },
  ];

  return (
    <div className="space-y-4">
      {/* Chart */}
      <div className="relative h-[280px] w-full">
        <canvas ref={chartRef} />
      </div>

      {/* Custom Legend */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm font-medium">
          <span>Categories</span>
          <div className="flex gap-4 text-xs">
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded border-2 border-gray-400"></div>
              <span>Interactions</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-3 w-3 rounded bg-gray-400"></div>
              <span>Submissions</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 text-sm lg:grid-cols-5">
          {categories.map(category => (
            <div key={category.key} className="flex items-center gap-2">
              <div
                className="h-3 w-3 rounded"
                style={{ backgroundColor: category.color }}
              ></div>
              <span className="truncate">{category.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Insights */}
      {/* <div className="rounded-lg bg-blue-50 p-3">
        <h4 className="font-medium text-blue-900">Key Insights</h4>
        <div className="mt-2 space-y-1 text-sm text-blue-800">
          <p>
            •{' '}
            <strong>
              {topCategory.charAt(0).toUpperCase() + topCategory.slice(1)}
            </strong>{' '}
            has the highest community engagement
          </p>
          <p>• Infrastructure issues show seasonal spikes in winter months</p>
          <p>• Environment engagement increases during spring season</p>
        </div>
      </div> */}

      {/* Engagement Metrics */}
      {/* <div className="grid grid-cols-3 gap-4 text-center text-sm">
        <div>
          <div className="font-semibold text-blue-600">
            {data.reduce(
              (sum, d) =>
                sum +
                d.infrastructure.submissions +
                d.environment.submissions +
                d.governance.submissions +
                d.publicSafety.submissions +
                d.transportation.submissions,
              0
            )}
          </div>
          <div className="text-gray-500">Total Submissions</div>
        </div>
        <div>
          <div className="font-semibold text-green-600">
            {data.reduce(
              (sum, d) =>
                sum +
                d.infrastructure.interactions +
                d.environment.interactions +
                d.governance.interactions +
                d.publicSafety.interactions +
                d.transportation.interactions,
              0
            )}
          </div>
          <div className="text-gray-500">Total Interactions</div>
        </div>
        <div>
          <div className="font-semibold text-purple-600">
            {Math.round(
              (data.reduce(
                (sum, d) =>
                  sum +
                  d.infrastructure.interactions +
                  d.environment.interactions +
                  d.governance.interactions +
                  d.publicSafety.interactions +
                  d.transportation.interactions,
                0
              ) /
                data.reduce(
                  (sum, d) =>
                    sum +
                    d.infrastructure.submissions +
                    d.environment.submissions +
                    d.governance.submissions +
                    d.publicSafety.submissions +
                    d.transportation.submissions,
                  0
                )) *
                10
            ) / 10}
          </div>
          <div className="text-gray-500">Avg Interactions/Issue</div>
        </div>
      </div> */}
    </div>
  );
}
