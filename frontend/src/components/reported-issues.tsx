import { Badge } from '@/components/ui/badge';
import timeAgo from '@/lib/timeAgo';
import { AlertCircle, CheckCircle, CircleAlert, Flame } from 'lucide-react';
import { ReportedIssue } from './IssuedCard';
import Link from 'next/link';

export function ReportedIssues({
  reportedIssues,
}: {
  reportedIssues: ReportedIssue[];
}) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getUrgencyColor = (urgency: string | undefined) => {
    switch (urgency) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 hover:bg-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getUrgencyIcon = (urgency: string | undefined) => {
    switch (urgency) {
      case 'low':
        return <CheckCircle className="h-4 w-4 mr-1 text-emerald-800" />;
      case 'medium':
        return <AlertCircle className="h-4 w-4 mr-1 text-yellow-800" />;
      case 'high':
        return <Flame className="h-4 w-4 mr-1 text-orange-800" />;
      case 'critical':
        return <CircleAlert className="h-4 w-4 mr-1 text-red-800" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5 px-3 pt-3">
      {reportedIssues.slice(0, 5).map(issue => (
        <div key={issue._id} className="border-b pb-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-medium">{issue.title}</h3>
            <div className="flex gap-1">
              <Badge className={`${getUrgencyColor(issue.urgency)} capitalize`}>
                {getUrgencyIcon(issue.urgency)}
                {issue.urgency}
              </Badge>
              <Badge className={`${getStatusColor(issue.status)} capitalize`}>
                {issue.status === 'inProgress' ? 'In Progress' : issue.status}
              </Badge>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Reported by: {issue.reportedBy.fullName}
          </p>
          <p className="my-1 text-sm">{issue.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {timeAgo(new Date(issue.createdAt))}
            </span>
            <Link
              href={''}
              className="text-blue-600 text-sm cursor-pointer hover:underline underline-offset-3"
            >
              View Details
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
