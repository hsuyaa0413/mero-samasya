import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

type Issue = {
  id: string;
  title: string;
  reporter: string;
  description: string;
  time: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
};

const issues: Issue[] = [
  {
    id: '1',
    title: 'Pothole on Main Street',
    reporter: 'Robert Wilson',
    description:
      'Large pothole near the intersection of Main and 5th, causing traffic issues...',
    time: '2 hours ago',
    status: 'Pending',
  },
  {
    id: '2',
    title: 'Graffiti in City Park',
    reporter: 'Emily Davis',
    description: 'Offensive graffiti on the west wall of the park restrooms...',
    time: '5 hours ago',
    status: 'In Progress',
  },
  {
    id: '3',
    title: 'Broken Streetlight',
    reporter: 'James Miller',
    description:
      'Streetlight at Oak and 3rd has been out for 3 days, making the area unsafe...',
    time: '1 day ago',
    status: 'Resolved',
  },
];

export function ReportedIssues() {
  return (
    <div className="space-y-4">
      {issues.map(issue => (
        <div key={issue.id} className="border-b pb-4">
          <div className="mb-1 flex items-center justify-between">
            <h3 className="font-medium">{issue.title}</h3>
            <Badge
              className={
                issue.status === 'Pending'
                  ? 'bg-yellow-100 text-yellow-800'
                  : issue.status === 'In Progress'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-green-100 text-green-800'
              }
            >
              {issue.status}
            </Badge>
          </div>
          <p className="text-sm text-gray-500">Reported by: {issue.reporter}</p>
          <p className="my-1 text-sm">{issue.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">{issue.time}</span>
            <Button
              variant="link"
              size="sm"
              className="h-auto p-0 text-skyBlue"
            >
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
