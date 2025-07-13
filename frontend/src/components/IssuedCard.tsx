import { MapPin } from 'lucide-react';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { User } from '@/store/userStore';
import timeAgo from '@/lib/timeAgo';

export interface ReportedIssue {
  _id: string;
  title: string;
  status: 'pending' | 'resolved' | 'inProgress';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  location: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  mediaUrls: string[];
  reportedBy: User;
}

const statusColors: { [key: string]: string } = {
  inProgress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  pending: 'bg-red-100 text-red-800',
};
interface IssuedCardProps {
  issuedReports: ReportedIssue;
}
export default function IssuedCard({ issuedReports }: IssuedCardProps) {
  return (
    <div className="overflow-hidden  rounded-xl border py-0 shadow-sm h-60 bg-white">
      <div className="flex items-center justify-between  px-4 pt-6 h-12  border-gray-300 bg-gray-100 pb-5">
        <div className="text-md font-semibold  ">{issuedReports.title}</div>
        <Badge
          className={
            statusColors[issuedReports.status] || 'bg-gray-100 text-gray-800'
          }
        >
          <span className="capitalize">
            {issuedReports?.status === 'inProgress'
              ? 'In Progress'
              : issuedReports?.status}
          </span>
        </Badge>
      </div>
      <div className="px-5 pt-6 h-32">
        <p className="text-darkBlue  line-clamp-3 ">
          {issuedReports.description}
        </p>
      </div>

      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 border-t-1 text-sm text-gray-600 mb-0 h-16">
        <div className="flex-1 flex items-start gap-1 line-clamp-2 text-darkBlue">
          <MapPin size={16} className=" w-7" />
          <span className="text-xs line-clamp-2">{issuedReports.location}</span>
        </div>
        <div className="whitespace-nowrap text-right text-xs flex-1 flex flex-col text-darkBlue gap-1">
          Reported: {timeAgo(new Date(issuedReports.createdAt))}
          <Link href={`/issues/${issuedReports._id}`}>
            <p className=" text-blue-700 cursor-pointer hover:underline">
              View Details
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
