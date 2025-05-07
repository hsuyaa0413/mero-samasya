'use client';

import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

export function IssuesByCategory() {
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

    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: [
          'Roads & Sidewalks',
          'Sanitation & Waste',
          'Public Safety',
          'Parks and Recreation',
          'Other',
        ],
        datasets: [
          {
            data: [35, 20, 25, 15, 5],
            backgroundColor: [
              '#6366f1', // Infrastructure - Indigo
              '#10b981', // Sanitation - Green
              '#ef4444', // Public Safety - Red
              '#f59e0b', // Environment - Amber
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
            position: 'right',
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
  }, []);

  return (
    <div className="relative h-85 w-full flex items-center justify-center">
      <canvas ref={chartRef} />
    </div>
  );
}
