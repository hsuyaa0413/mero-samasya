'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { ReportedIssue } from './IssuedCard';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import isEqual from 'lodash/isEqual';

Chart.register(...registerables);

interface IssuesByCategoryProps {
  reportedIssues: ReportedIssue[];
}

function IssuesByCategoryComponent({ reportedIssues }: IssuesByCategoryProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  const getIssueCategoryData = (issues: ReportedIssue[]) => {
    const categoryCount = new Map<string, number>();

    issues.forEach(issue => {
      const formattedCategory = issue.category || 'Uncategorized';
      categoryCount.set(
        formattedCategory,
        (categoryCount.get(formattedCategory) || 0) + 1
      );
    });

    const categoryLabels = Array.from(categoryCount.keys());
    const categoryCounts = Array.from(categoryCount.values());
    console.log('Category counts:', { categoryLabels, categoryCounts });

    return { categoryLabels, categoryCounts };
  };

  useEffect(() => {
    console.log(
      'IssuesByCategory useEffect triggered at',
      new Date().toISOString()
    );

    if (!chartRef.current) {
      console.warn('chartRef.current is null, skipping chart creation');
      return;
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) {
      console.warn('Canvas context is null, skipping chart creation');
      return;
    }

    const { categoryLabels, categoryCounts } =
      getIssueCategoryData(reportedIssues);

    if (chartInstance.current) {
      // Update existing chart
      try {
        chartInstance.current.data.labels = categoryLabels;
        chartInstance.current.data.datasets[0].data = categoryCounts;
        chartInstance.current.update();
        console.log('Chart updated with new data');
      } catch (error) {
        console.warn('Chart update failed, recreating chart:', error);
        // If update fails, destroy old chart and create new one
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    }
    
    if (!chartInstance.current) {
      // Create new chart
      chartInstance.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: categoryLabels,
          datasets: [
            {
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
          animation: false, // Disable animations to prevent flicker
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
      console.log('New chart created');
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
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
      <canvas ref={chartRef} suppressHydrationWarning />
    </div>
  );
}

export const IssuesByCategory = memo(
  IssuesByCategoryComponent,
  (prevProps, nextProps) => {
    const isEqualProps = isEqual(
      prevProps.reportedIssues,
      nextProps.reportedIssues
    );
    console.log('IssuesByCategory memo check:', { isEqualProps });
    return isEqualProps;
  }
);
