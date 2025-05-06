'use client';
import Image from 'next/image';
import {
  Search,
  Bell,
  Mail,
  Plus,
  UserPlus,
  CheckCircle,
  MessageSquare,
  Send,
  LayoutDashboard,
  FileText,
  ChevronUp,
  Check,
  ChevronDown,
  Clock,
  TriangleAlert,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/store/userStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default function AuthorityDashboard() {
  const { user } = useUserStore();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-2/12 bg-skyBlue text-white flex flex-col">
        <div className="p-4 border-b border-lightBlue-75">
          <h1 className="font-bold text-xl">Mero Samasya</h1>
          <p className="text-sm text-lightBlue-75">Authority Dashboard</p>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li className="hover:bg-blue-950">
              <a href="" className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <LayoutDashboard />
                </div>
                <span>Dashboard</span>
              </a>
            </li>

            <li className="hover:bg-blue-950">
              <a href="" className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <FileText />
                </div>
                <span>Issues</span>
              </a>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-lightBlue-75 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
            <Avatar className="cursor-pointer">
              <AvatarImage src="https://avatar.iran.liara.run/public/job/operator/male" />
              <AvatarFallback className="bg-greyBlue text-darkBlue">
                {user?.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
          </div>

          <div>
            <div className="font-medium text-sm">{user?.name}</div>
            <div className="text-xs text-lightBlue-75">Administrator</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-10/12">
        <header className="bg-lightBlue p-4 border-b flex justify-between items-center sticky top-0 z-10 px-10">
          <h1 className="text-xl font-bold text-darkBlue">
            Issue Management Dashboard
          </h1>
          <div className="flex items-center">
            <div className="relative bg-gray-50 rounded-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-skyBlue"
              />
            </div>
          </div>
        </header>

        <main className="py-6 px-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 min-h-32 bg-white">
              <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                <FileText className="text-blue-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Issues</p>
                <p className="text-2xl font-bold">142</p>
                <div className="flex items-center text-xs gap-1 text-green-500">
                  <ChevronUp size={12} /> 12% from last week
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 min-h-32 bg-white">
              <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                <Check className="text-green-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold">89</p>
                <div className="flex items-center text-xs gap-1 text-green-500">
                  <ChevronUp size={12} /> 8% from last week
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 min-h-32 bg-white">
              <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">32</p>
                <div className="flex items-center text-xs gap-1 text-red-500">
                  <ChevronDown size={12} /> 5% from last week
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 min-h-32 bg-white">
              <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
                <TriangleAlert className="text-red-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold">21</p>
                <div className="flex items-center text-xs gap-1 text-red-500">
                  <ChevronUp size={12} /> 15% from last week
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <Select>
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inprogress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Select>
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dharan">Dharan</SelectItem>
                    <SelectItem value="itahari">Itahari</SelectItem>
                    <SelectItem value="biratnagar">Biratnagar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Urgency
                </label>
                <Select>
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="#issues">
            {/* Recent Issues */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-1 bg-gray-50">
                  <h2 className="text-lg font-medium ">Recent Issues</h2>
                </div>

                <div className="divide-y">
                  {/* Issue 1 */}
                  <IssueCard
                    title="Road Damage"
                    description="Large pothole causing traffic disruptions and vehicle damage"
                    reported="5 hours ago"
                    reporter="Ramesh Nepali"
                    status="Pending"
                    statusColor="yellow"
                    id="4324234234234"
                  />

                  <IssueCard
                    title="Street Light Outage"
                    description="Multiple street lights not working on Oak Avenue"
                    reported="12 hours ago"
                    reporter="Michael Brown"
                    status="Resolved"
                    statusColor="green"
                    id="567575565"
                  />

                  {/* Issue 3 */}
                  {/* <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded">
                          Resolved
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">#ISSUE-243</span>
                    </div>
                    <h3 className="font-medium mb-1">
                      Garbage Collection Missed
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Residential area garbage not collected on schedule
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=24&width=24"
                            alt="Emily Wilson"
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm">Emily Wilson</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          Reported: 3 days ago
                        </span>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div> */}

                  {/* Issue 4 */}
                  {/* <div className="p-4">
                    <div className="flex justify-between mb-2">
                      <div className="flex gap-2">
                        <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-800 rounded">
                          Assigned
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">#ISSUE-242</span>
                    </div>
                    <h3 className="font-medium mb-1">Park Maintenance</h3>
                    <p className="text-sm text-gray-600 mb-3">
                      Playground equipment needs repair in Central Park
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gray-300 overflow-hidden">
                          <Image
                            src="/placeholder.svg?height=24&width=24"
                            alt="David Miller"
                            width={24}
                            height={24}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm">David Miller</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-xs text-gray-500">
                          Reported: 4 days ago
                        </span>
                        <a
                          href="#"
                          className="text-sm text-blue-600 hover:underline"
                        >
                          View Details
                        </a>
                      </div>
                    </div>
                  </div> */}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Average Resolution Time */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">
                    Average Resolution Time
                  </h2>
                </div>
                <div className="p-4">
                  <div className="h-64">
                    <ResolutionTimeChart />
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Quick Actions</h2>
                </div>
                <div className="p-4 grid grid-cols-2 gap-4">
                  <button className="bg-blue-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
                    <UserPlus className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Assign Issue</span>
                  </button>
                  <button className="bg-green-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-green-100 transition-colors">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">Mark Resolved</span>
                  </button>
                  <button className="bg-purple-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-purple-100 transition-colors">
                    <MessageSquare className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">Add Note</span>
                  </button>
                  <button className="bg-yellow-50 p-4 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-yellow-100 transition-colors">
                    <Send className="h-6 w-6 text-yellow-600" />
                    <span className="text-sm font-medium">Send Update</span>
                  </button>
                </div>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ResolutionTimeChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const data = [3.1, 2.8, 2.3, 3.0, 2.7, 2.2];
  const maxValue = Math.max(...data);

  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-gray-500 mb-1">
        Average Resolution Time (days)
      </div>
      <div className="flex-1 flex items-end">
        {data.map((value, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-blue-200 mx-0.5"
              style={{
                height: `${(value / maxValue) * 100}%`,
                maxWidth: '30px',
                margin: '0 auto',
              }}
            ></div>
            <div className="text-xs mt-1">{months[index]}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function IssueCard({
  status,
  statusColor,
  title,
  reporter,
  reported,
  description,
  id,
}: {
  status: string;
  statusColor: 'yellow' | 'green' | 'blue' | 'red';
  title: string;
  reporter: string;
  reported: string;
  description: string;
  id: string;
}) {
  const statusColors: {
    yellow: string;
    green: string;
    blue: string;
    red: string;
  } = {
    yellow: 'bg-yellow-100 text-yellow-800',
    green: 'bg-green-100 text-green-800',
    blue: 'bg-blue-100 text-blue-800',
    red: 'bg-red-100 text-red-800',
  };

  return (
    <div className="overflow-hidden py-0 space-y-1">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-md font-semibold">{title}</div>

        <div className="flex items-center gap-1">
          <Badge className="bg-red-100 text-red-800">Urgent</Badge>
          <Badge className={`${statusColors[statusColor]}`}>{status}</Badge>
        </div>
      </div>

      <p className="px-4 text-gray-500">{description}</p>

      <div className="flex items-center justify-between p-10 sm:p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer">
            <AvatarImage src="https://avatar.iran.liara.run/public/boy" />
            <AvatarFallback className="bg-greyBlue text-darkBlue">
              {/* {user?.name
                .split(' ')
                .map(n => n[0])
                .join('')} */}{' '}
              RN
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-0.5 sm:gap-1 ">{reporter}</div>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-gray-500">Reported: {reported}</div>
          <Link
            href={`/issues/${id}`}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
