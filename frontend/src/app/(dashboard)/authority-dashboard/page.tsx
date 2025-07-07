'use client';

import {
  Search,
  LayoutDashboard,
  FileText,
  Check,
  Clock,
  TriangleAlert,
  LogOut,
  CheckCircle,
  AlertCircle,
  Flame,
  CircleAlert,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, useUserStore } from '@/store/userStore';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import axios from 'axios';
import { backendApi } from '@/lib/constant';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo, Fragment } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

interface ReportedIssue {
  _id: string;
  title: string;
  status: 'pending' | 'resolved' | 'inProgress';
  statusColor: string;
  description: string;
  location: string;
  createdAt: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  reportedBy: User;
  mediaUrls: string[];
}

export default function AuthorityDashboard() {
  const { user, logout } = useUserStore();
  const router = useRouter();

  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  useEffect(() => {
    const fetchReportedIssues = async () => {
      try {
        const res = await axios.get(`${backendApi}/report/get-reports`, {
          withCredentials: true,
        });

        if (res.data && Array.isArray(res.data.data)) {
          setReportedIssues(res.data.data);
        } else {
          console.error('Expected an array in data, but received:', res.data);
        }
      } catch (error) {
        console.error('Error fetching reported issues:', error);
      }
    };

    fetchReportedIssues();
  }, []);

  const filteredIssues = useMemo(() => {
    return reportedIssues.filter(issue => {
      const searchTermLower = searchTerm.toLowerCase();

      // Text search condition (checks title and description)
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTermLower) ||
        issue.description.toLowerCase().includes(searchTermLower);

      // Status filter condition
      const matchesStatus =
        selectedStatus === 'all' || issue.status === selectedStatus;

      // Location filter condition (checks if location string includes the selected value)
      const matchesLocation =
        selectedLocation === 'all' ||
        issue.location.toLowerCase().includes(selectedLocation.toLowerCase());

      // Urgency filter condition
      const matchesUrgency =
        selectedUrgency === 'all' || issue.urgency === selectedUrgency;

      return (
        matchesSearch && matchesStatus && matchesLocation && matchesUrgency
      );
    });
  }, [
    reportedIssues,
    searchTerm,
    selectedStatus,
    selectedLocation,
    selectedUrgency,
  ]);

  async function handleLogOut() {
    try {
      const res = await axios.get(`${backendApi}/auth/logout`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        logout();
        router.push('/');
      }
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-2/12 bg-skyBlue text-white flex flex-col">
        <div className="p-4 border-b border-lightBlue-75 h-18">
          <h1 className="font-bold text-xl">Mero Samasya</h1>
          <p className="text-sm text-lightBlue-75">Authority Dashboard</p>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li className="hover:bg-blue-950">
              <Link href="#" className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <LayoutDashboard />
                </div>
                <span>Dashboard</span>
              </Link>
            </li>

            <li className="hover:bg-blue-950">
              <Link href="" className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <FileText />
                </div>
                <span>Issues</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-lightBlue-75 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gray-300 overflow-hidden">
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://avatar.iran.liara.run/public/job/operator/male" />
                <AvatarFallback className="bg-greyBlue text-darkBlue">
                  {user?.fullName
                    .split(' ')
                    .map(n => n[0])
                    .join('')}
                </AvatarFallback>
              </Avatar>
            </div>

            <div>
              <div className="font-medium text-sm">{user?.fullName}</div>
              <div className="text-xs text-lightBlue-75">Administrator</div>
            </div>
          </div>

          <button onClick={handleLogOut} className="cursor-pointer">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-10/12">
        <header className="bg-lightBlue p-4 border-b flex justify-between items-center sticky top-0 z-10 px-10 h-18">
          <h1 className="text-xl font-bold text-darkBlue">
            Issue Management Dashboard
          </h1>
          <div className="flex items-center">
            <div className="relative bg-gray-50 rounded-lg">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by title or description"
                className="pl-10 pr-4 py-2 border rounded-lg w-72 focus:outline-none focus:ring-2 focus:ring-skyBlue"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="py-6 px-10">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 h-28 bg-white">
              <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                <FileText className="text-blue-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Total Issues</p>
                <p className="text-2xl font-bold">{reportedIssues?.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 h-28 bg-white">
              <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                <Check className="text-emerald-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Resolved</p>
                <p className="text-2xl font-bold">
                  {
                    reportedIssues?.filter(issue => issue.status === 'resolved')
                      .length
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 h-28 bg-white">
              <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                <Clock className="text-yellow-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold">
                  {
                    reportedIssues?.filter(
                      issue => issue.status === 'inProgress'
                    ).length
                  }
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 border-1 rounded-lg shadow-sm px-4 h-28 bg-white">
              <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
                <TriangleAlert className="text-red-500 size-10" />
              </div>
              <div>
                <p className="text-xs sm:text-sm text-gray-500">Urgent</p>
                <p className="text-2xl font-bold">
                  {
                    reportedIssues?.filter(
                      issue =>
                        issue.urgency === 'critical' || issue.urgency === 'high'
                    ).length
                  }
                </p>
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
                <Select
                  value={selectedStatus}
                  onValueChange={setSelectedStatus}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inProgress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <Select
                  value={selectedLocation}
                  onValueChange={setSelectedLocation}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select a location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
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
                <Select
                  value={selectedUrgency}
                  onValueChange={setSelectedUrgency}
                >
                  <SelectTrigger className="w-full border rounded px-3 py-1.5">
                    <SelectValue placeholder="Select urgency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Urgencies</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="issues">
            {/* Recent Issues */}
            <div className="lg:col-span-2">
              <ScrollArea className="bg-white rounded-lg shadow-sm h-[23rem]">
                <div className="p-4 border-1 bg-gray-100">
                  <h2 className="text-lg font-semibold">Recent Issues</h2>
                </div>

                {/* <div className="divide-y"> */}
                <div>
                  {filteredIssues.length > 0 ? (
                    filteredIssues.map(issue => (
                      <Fragment key={issue?._id}>
                        <IssueCard
                          key={issue?._id}
                          title={issue?.title}
                          description={issue?.description}
                          reported={issue?.createdAt.split('T')[0]}
                          reportedBy={issue?.reportedBy?.fullName}
                          status={issue?.status}
                          urgency={issue?.urgency}
                          id={issue?._id}
                        />
                        <Separator />
                      </Fragment>
                    ))
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      No issues match the current filters.
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Total Issues Reported */}
              {/* <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-medium">Total Issues Reported</h2>
                </div>
                <div className="p-4">
                  <div className="h-64"> */}
              <ResolutionTimeChart reportedIssues={reportedIssues} />
              {/* </div>
                </div>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function ResolutionTimeChart({
  reportedIssues,
}: {
  reportedIssues: ReportedIssue[];
}) {
  interface ChartDataItem {
    month: string;
    issues: number;
  }

  const monthlyIssueCounts: { [key: string]: number } = {};

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  monthNames.forEach(month => {
    monthlyIssueCounts[month] = 0;
  });

  reportedIssues.forEach(issue => {
    const date = new Date(issue.createdAt);
    const monthIndex = date.getMonth(); // getMonth() returns 0-11
    const monthName = monthNames[monthIndex];
    monthlyIssueCounts[monthName]++;
  });

  // Convert the aggregated data into the desired array format
  const chartData: ChartDataItem[] = monthNames.map(month => ({
    month: month,
    issues: monthlyIssueCounts[month],
  }));

  const chartConfig = {
    issues: {
      label: 'Issues',
      color: 'var(--chart-1)',
    },
  } satisfies ChartConfig;

  return (
    <Card className="h-[23rem]">
      <CardHeader>
        <CardTitle className="text-lg">Total Issues Reported</CardTitle>
        <p className="text-xs text-gray-500">Jan - Dec, 2025</p>
      </CardHeader>
      <CardContent className="h-full px-5 flex justify-center">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={val => val.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="issues" fill="#8ec5fe" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Monthly Issues Overview
        </div>
        <div className="text-muted-foreground leading-none">
          Showing total issues reported for the last 12 months
        </div>
      </CardFooter>
    </Card>
  );
}

function IssueCard({
  status,
  title,
  reportedBy,
  reported,
  description,
  id,
  urgency,
}: {
  status: 'pending' | 'resolved' | 'inProgress';
  title: string;
  reportedBy: string;
  reported: string;
  description: string;
  id: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}) {
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

  return (
    <div className="overflow-hidden py-0 space-y-1">
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="text-md font-semibold">{title}</div>

        <div className="flex items-center gap-1">
          <Badge className={`${getUrgencyColor(urgency)} capitalize`}>
            {getUrgencyIcon(urgency)}
            {urgency}
          </Badge>
          <Badge className={getStatusColor(status)}>
            <span className="capitalize">
              {status === 'inProgress' ? 'In Progress' : status}
            </span>
          </Badge>
        </div>
      </div>

      <p className="px-4 text-gray-500">{description}</p>

      <div className="flex items-center justify-between p-10 sm:p-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Avatar className="cursor-pointer">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${
                Math.floor(Math.random() * 100) + 1
              }`}
            />
            <AvatarFallback className="bg-greyBlue text-darkBlue">
              {reportedBy
                ?.split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center gap-0.5 sm:gap-1 ">
            {reportedBy}
          </div>
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
