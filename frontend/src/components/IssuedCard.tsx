import { backendApi } from '@/lib/constant';
import React, { useEffect, useState } from 'react';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { MapPin } from 'lucide-react';

// Define the type for each reported issue
interface ReportedIssue {
  title: string;
  status: 'pending' | 'resolved' | 'rejected';
  statusColor: string;
  description: string;
  location: string;
  updatedAt: string;
  mediaUrls: string[];
}

const statusColors: { [key: string]: string } = {
  pending: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  // Add more as needed
};

export default function IssuedCard() {
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);

  useEffect(() => {
    const fetchReportedIssues = async () => {
      const res = await fetch(`${backendApi}/report/get-reports`);
      const data = await res.json();
      // Ensure the response contains the 'data' field and it is an array
      if (data && Array.isArray(data.data)) {
        setReportedIssues(data.data); // Set the 'data' property
        console.log('Reported Issues:', data.data);
      } else {
        console.error('Expected an array in data, but received:', data);
      }
    };
    fetchReportedIssues();
  }, []);

  // Function to format the date to 'YYYY-MM-DD'
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Ensure two digits
    const day = String(date.getDate()).padStart(2, '0'); // Ensure two digits
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {reportedIssues.length > 0 ? (
        reportedIssues.map((issue, index) => (
          <Card key={index} className="overflow-hidden py-0 ">
            <div className="flex items-center justify-between px-4 pt-6  ">
              <div className="text-md font-semibold ">{issue.title}</div>
              <Badge
                className={
                  statusColors[issue.statusColor] || 'bg-gray-100 text-gray-800'
                }
              >
                {issue.status}
              </Badge>
            </div>

            {/* {' '}
              <div className="absolute inset-0 bg-black/35 backdrop-blur-sm z-0" /> */}
            {/* Description text */}
            <p className="text-darkBlue px-4">{issue.description}</p>

            <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 text-sm text-gray-600 mt-auto h-18">
              <div className="flex-1 flex items-center gap-1 truncate pr-2">
                <MapPin size={16} />
                <span className="truncate">{issue.location}</span>
              </div>
              <div className="whitespace-nowrap text-right">
                Reported: {formatDate(issue.updatedAt)}
              </div>
            </div>
          </Card>
        ))
      ) : (
        <div className="px-4 py-2 text-gray-500">No reports found.</div>
      )}
    </div>
  );
}
