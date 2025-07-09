'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ReportedIssue } from './IssuedCard';
import { Loader2 } from 'lucide-react';

Chart.register(...registerables);

export function IssuesByCategory({
  reportedIssues,
}: {
  reportedIssues: ReportedIssue[];
}) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const getIssueCategoryLabels = (issues: ReportedIssue[]) => {
    const labels = issues.map(issue =>
      issue.category
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );

    return Array.from(new Set(labels));
  };

  useEffect(() => {
    if (!chartRef.current) return;

    // Destroy existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Create new chart
    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const categoryLabels = getIssueCategoryLabels(reportedIssues);
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categoryLabels,
        // labels: [
        //   'Roads & Sidewalks',
        //   'Sanitation & Waste',
        //   'Public Safety',
        //   'Parks and Recreation',
        //   'Other',
        // ],
        datasets: [
          {
            data: [35, 20, 25, 15, 5],
            backgroundColor: [
              '#10b981', // Sanitation - Green
              '#6366f1', // Infrastructure - Indigo
              '#f59e0b', // Environment - Amber
              '#eab308', // Street Lighting - Yellow
              '#ef4444', // Public Safety - Red
              '#22c55e', // Parks and Recreation - Emerald
              '#6b7280', // Other - Gray
            ],
            borderWidth: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '60%',
        plugins: {
          legend: {
            position: 'left',
            labels: {
              boxWidth: 12,
              padding: 15,
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
  }, [reportedIssues]);

  if (reportedIssues.length === 0) {
    return (
      <div className="relative h-85 w-full flex items-center justify-center">
        <p className="flex items-center justify-center gap-2">
          <Loader2 className="animate-spin size-5 text-blue-500" /> Loading the
          pie chart...
        </p>
      </div>
    );
  }
  return (
    <div className="relative h-85 w-full flex items-center justify-center">
      <canvas ref={chartRef} />
    </div>
  );
}
