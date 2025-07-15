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

  const getIssueCategoryData = (issues: ReportedIssue[]) => {
    const categoryCount = new Map<string, number>();

    // Count occurrences of each formatted category
    issues.forEach(issue => {
      const formattedCategory = issue.category;
      // .split('-')
      // .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      // .join(' ');

      categoryCount.set(
        formattedCategory,
        (categoryCount.get(formattedCategory) || 0) + 1
      );
    });

    const categoryLabels = Array.from(categoryCount.keys());
    const categoryCounts = Array.from(categoryCount.values());

    return { categoryLabels, categoryCounts };
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

    const { categoryLabels, categoryCounts } =
      getIssueCategoryData(reportedIssues);

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
            // data: [35, 20, 25, 15, 5],
            data: categoryCounts,
            backgroundColor: [
              '#FF6384', // Pink/Red
              '#36A2EB', // Blue
              '#FFCD56', // Yellow
              '#4BC0C0', // Teal
              '#9966FF', // Purple
              '#FF9F40', // Orange
              '#C7C7C7', // Gray
            ],
            borderWidth: 2,
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
