import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

type Approval = {
  id: string;
  name: string;
  department: string;
  avatar: string;
};

const approvals: Approval[] = [
  {
    id: '1',
    name: 'John Smith',
    department: 'Police Department',
    avatar: `https://avatar.iran.liara.run/public/${
      Math.floor(Math.random() * 100) + 1
    }`,
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    department: 'Public Works',
    avatar: `https://avatar.iran.liara.run/public/${
      Math.floor(Math.random() * 100) + 1
    }`,
  },
  {
    id: '3',
    name: 'Michael Brown',
    department: 'Environmental Agency',
    avatar: `https://avatar.iran.liara.run/public/${
      Math.floor(Math.random() * 100) + 1
    }`,
  },
];

export function PendingApprovals() {
  return (
    <div className="space-y-4">
      {approvals.map(approval => (
        <div
          key={approval.id}
          className="flex items-center justify-between border-b pb-4"
        >
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={approval.avatar} alt={approval.name} />
              <AvatarFallback>{approval.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{approval.name}</p>
              <p className="text-sm text-gray-500">{approval.department}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-green-100 text-green-700 hover:bg-green-200"
            >
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              Reject
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
