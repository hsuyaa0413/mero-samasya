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
  Menu,
} from 'lucide-react';
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
import timeAgo from '@/lib/timeAgo';
import { ReportedIssue } from '@/components/IssuedCard';

export default function AuthorityDashboard() {
  const { user, logout } = useUserStore();
  const router = useRouter();
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  // Capitalize the department name for display
  const departmentName = user?.departments
    ? user.departments.charAt(0).toUpperCase() + user.departments.slice(1)
    : '';

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

  useEffect(() => {
    fetchReportedIssues();
  }, []);

  const filteredIssues = useMemo(() => {
    return reportedIssues.filter(issue => {
      const searchTermLower = searchTerm.toLowerCase();
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTermLower) ||
        issue.description.toLowerCase().includes(searchTermLower);
      const matchesStatus =
        selectedStatus === 'all' || issue.status === selectedStatus;
      const matchesUrgency =
        selectedUrgency === 'all' || issue.urgency === selectedUrgency;
      const matchesDepartment =
        user?.departments === 'municipality' ||
        issue.category === user?.departments;

      return (
        matchesSearch && matchesStatus && matchesUrgency && matchesDepartment
      );
    });
  }, [
    reportedIssues,
    searchTerm,
    selectedStatus,
    selectedUrgency,
    user?.departments,
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
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Sidebar Backdrop for Mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-56 bg-skyBlue text-white flex flex-col transform transition-transform duration-300 md:w-2/12 md:static md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-lightBlue-75 h-16 flex justify-between items-center">
          <div>
            <h1 className="font-bold text-lg">Mero Samasya</h1>
            <p className="text-xs text-lightBlue-75">Authority Dashboard</p>
          </div>
          <button className="md:hidden" onClick={() => setIsSidebarOpen(false)}>
            <Menu size={20} />
          </button>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li
              className="hover:bg-blue-950 transition-colors duration-200 cursor-pointer"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <LayoutDashboard size={18} />
                </div>
                <span className="text-sm">Dashboard</span>
              </div>
            </li>
            <li
              className="hover:bg-blue-950 transition-colors duration-200 cursor-pointer"
              onClick={() => setActiveTab('issues')}
            >
              <div className="flex items-center gap-3 px-4 py-2">
                <div className="w-5 h-5 flex items-center justify-center">
                  <FileText size={18} />
                </div>
                <span className="text-sm">Issues</span>
              </div>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-lightBlue-75 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gray-300 overflow-hidden">
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://avatar.iran.liara.run/public/job/operator/male" />
                <AvatarFallback className="bg-greyBlue text-darkBlue text-xs">
                  {user?.fullName
                    ?.split(' ')
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
          <button
            onClick={handleLogOut}
            className="cursor-pointer hover:text-gray-300 transition-colors duration-200"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto w-full">
        <header className="bg-lightBlue p-3 flex flex-col sm:flex-row sm:justify-between items-center sticky top-0 z-10 px-4 sm:px-6 h-auto border-b border-gray-300">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              className="md:hidden"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-darkBlue truncate">
              Authority Dashboard {departmentName ? `(${departmentName})` : ''}
            </h1>
          </div>
          <div className="flex items-center mt-2 sm:mt-0 w-full sm:w-auto justify-center">
            <div className="relative bg-white rounded-full shadow-sm border border-gray-200 transition-all duration-200 w-full sm:w-48 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search issues"
                className="pl-10 pr-3 py-2 rounded-full w-full text-sm focus:outline-none focus:ring-2 focus:ring-skyBlue focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </header>

        <main className="py-4 px-3 sm:px-4 md:px-6">
          {activeTab === 'dashboard' ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="flex items-center gap-3 border rounded-lg shadow-sm px-3 py-4 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                    <FileText className="text-blue-500 size-6 sm:size-8" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Total Issues</p>
                    <p className="text-lg sm:text-xl font-bold">
                      {filteredIssues.length}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border rounded-lg shadow-sm px-3 py-4 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="bg-emerald-100 p-2 rounded-full flex items-center justify-center">
                    <Check className="text-emerald-500 size-6 sm:size-8" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Resolved</p>
                    <p className="text-lg sm:text-xl font-bold">
                      {
                        filteredIssues.filter(
                          issue => issue.status === 'resolved'
                        ).length
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border rounded-lg shadow-sm px-3 py-4 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                    <Clock className="text-yellow-500 size-6 sm:size-8" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">In Progress</p>
                    <p className="text-lg sm:text-xl font-bold">
                      {
                        filteredIssues.filter(
                          issue => issue.status === 'inProgress'
                        ).length
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 border rounded-lg shadow-sm px-3 py-4 bg-white hover:shadow-md transition-shadow duration-200">
                  <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
                    <TriangleAlert className="text-red-500 size-6 sm:size-8" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Urgent</p>
                    <p className="text-lg sm:text-xl font-bold">
                      {
                        filteredIssues.filter(
                          issue =>
                            issue.urgency === 'critical' ||
                            issue.urgency === 'high'
                        ).length
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm mb-4 md:mb-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center">
                  <div className="w-full max-w-[12rem]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">
                      Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-skyBlue focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full max-w-[12rem]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">
                      Urgency
                    </label>
                    <Select
                      value={selectedUrgency}
                      onValueChange={setSelectedUrgency}
                    >
                      <SelectTrigger className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-skyBlue focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
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

              <div
                className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6"
                id="issues"
              >
                {/* Recent Issues */}
                <div className="lg:col-span-2">
                  <ScrollArea className="bg-white rounded-lg shadow-sm h-[20rem] sm:h-[23rem]">
                    <div className="p-3 sm:p-4 border bg-gray-100">
                      <h2 className="text-base sm:text-lg font-semibold">
                        Recent Issues
                      </h2>
                    </div>
                    <div>
                      {filteredIssues.length > 0 ? (
                        filteredIssues.map(issue => (
                          <Fragment key={issue?._id}>
                            <IssueCard
                              key={issue?._id}
                              title={issue?.title}
                              description={issue?.description}
                              reported={issue?.createdAt}
                              reportedBy={issue?.reportedBy?.fullName}
                              status={issue?.status}
                              urgency={issue?.urgency}
                              id={issue?._id}
                              isGrid={false}
                            />
                            <Separator />
                          </Fragment>
                        ))
                      ) : (
                        <div className="p-4 text-center text-gray-500 text-sm">
                          No issues match the current filters.
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>

                {/* Right Column */}
                <div className="space-y-4 md:space-y-6">
                  <ResolutionTimeChart reportedIssues={filteredIssues} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Filters for Issues Tab */}
              <div className="bg-white p-3 sm:p-4 rounded-xl shadow-sm mb-4 md:mb-6 border border-gray-100">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 justify-items-center">
                  <div className="w-full max-w-[12rem]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">
                      Status
                    </label>
                    <Select
                      value={selectedStatus}
                      onValueChange={setSelectedStatus}
                    >
                      <SelectTrigger className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-skyBlue focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="resolved">Resolved</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-full max-w-[12rem]">
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5 text-center">
                      Urgency
                    </label>
                    <Select
                      value={selectedUrgency}
                      onValueChange={setSelectedUrgency}
                    >
                      <SelectTrigger className="w-full border border-gray-200 rounded-lg px-2 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 focus:ring-2 focus:ring-skyBlue focus:border-transparent transition-all duration-200">
                        <SelectValue placeholder="Select urgency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border border-gray-200 rounded-lg shadow-lg">
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

              {/* All Issues in Grid Format */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {filteredIssues.length > 0 ? (
                  filteredIssues.map(issue => (
                    <Card
                      key={issue?._id}
                      className="bg-gradient-to-b from-white to-gray-50 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.03] border border-gray-100 rounded-xl"
                    >
                      <IssueCard
                        title={issue?.title}
                        description={issue?.description}
                        reported={issue?.createdAt}
                        reportedBy={issue?.reportedBy?.fullName}
                        status={issue?.status}
                        urgency={issue?.urgency}
                        id={issue?._id}
                        isGrid={true}
                      />
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center text-gray-500 text-sm p-4">
                    No issues match the current filters.
                  </div>
                )}
              </div>
            </>
          )}
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
    const monthIndex = date.getMonth();
    const monthName = monthNames[monthIndex];
    monthlyIssueCounts[monthName]++;
  });

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
    <Card className="h-[20rem] sm:h-[23rem]">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg">
          Total Issues Reported
        </CardTitle>
        <p className="text-xs text-gray-500">Jan - Dec, 2025</p>
      </CardHeader>
      <CardContent className="h-full px-3 sm:px-5 flex justify-center">
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 10,
              right: 5,
              left: 5,
              bottom: 5,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={8}
              axisLine={false}
              tickFormatter={val => val.slice(0, 3)}
              fontSize={10}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="issues" fill="#8ec5fe" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 text-xs">
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
  isGrid,
}: {
  status: 'pending' | 'resolved' | 'inProgress';
  title: string;
  reportedBy: string;
  reported: string;
  description: string;
  id: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  isGrid: boolean;
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
        return <CheckCircle className="h-3 w-3 mr-1 text-emerald-800" />;
      case 'medium':
        return <AlertCircle className="h-3 w-3 mr-1 text-yellow-800" />;
      case 'high':
        return <Flame className="h-3 w-3 mr-1 text-orange-800" />;
      case 'critical':
        return <CircleAlert className="h-3 w-3 mr-1 text-red-800" />;
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

  if (isGrid) {
    return (
      <div className="flex flex-col h-full px-3 space-y-2 ">
        {/* Status, Title, Urgency Row */}
        <div className="flex items-center justify-between mb-3 mt-[-6px]">
          <Badge
            className={`${getStatusColor(
              status
            )} capitalize text-xs py-1 px-2.5 rounded-md font-medium`}
          >
            <span>{status === 'inProgress' ? 'In Progress' : status}</span>
          </Badge>
          <h3 className="text-base font-bold text-gray-800 text-center truncate flex-1 mx-2">
            {title}
          </h3>
          <Badge
            className={`${getUrgencyColor(
              urgency
            )} capitalize text-xs py-1 px-2.5 rounded-md font-medium`}
          >
            {getUrgencyIcon(urgency)}
            {urgency}
          </Badge>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 flex-grow overflow-hidden text-ellipsis whitespace-nowrap mb-5">
          {description}
        </p>

        {/* User Info and Actions */}
        <div className="flex items-center justify-between text-xs text-gray-600 border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-6 h-6 cursor-pointer">
              <AvatarImage
                src={`https://avatar.iran.liara.run/public/${
                  Math.floor(Math.random() * 100) + 1
                }`}
              />
              <AvatarFallback className="bg-greyBlue text-darkBlue text-xs">
                {reportedBy
                  ?.split(' ')
                  .map(n => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="truncate max-w-[120px]">{reportedBy}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="text-xs text-gray-500">
              Reported: {timeAgo(new Date(reported))}
            </div>
            <Link
              href={`/issues/${id}`}
              className="text-blue-600 text-xs hover:underline underline-offset-2"
            >
              View Details
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden py-2 space-y-1 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex flex-col items-start justify-between px-3">
        <div className="text-sm font-semibold truncate">{title}</div>
        <div className="flex items-center gap-1 mt-1">
          <Badge
            className={`${getUrgencyColor(urgency)} capitalize text-xs py-0.5`}
          >
            {getUrgencyIcon(urgency)}
            {urgency}
          </Badge>
          <Badge className={`${getStatusColor(status)} text-xs py-0.5`}>
            <span className="capitalize">
              {status === 'inProgress' ? 'In Progress' : status}
            </span>
          </Badge>
        </div>
      </div>
      <p className="px-3 text-gray-500 text-sm line-clamp-2">{description}</p>
      <div className="flex flex-col items-start gap-2 p-3 text-xs text-gray-600">
        <div className="flex items-center gap-2">
          <Avatar className="w-6 h-6 cursor-pointer">
            <AvatarImage
              src={`https://avatar.iran.liara.run/public/${
                Math.floor(Math.random() * 100) + 1
              }`}
            />
            <AvatarFallback className="bg-greyBlue text-darkBlue text-xs">
              {reportedBy
                ?.split(' ')
                .map(n => n[0])
                .join('')}
            </AvatarFallback>
          </Avatar>
          <div className="truncate">{reportedBy}</div>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="text-xs text-gray-500">
            Reported: {timeAgo(new Date(reported))}
          </div>
          <Link
            href={`/issues/${id}`}
            className="text-blue-600 text-xs hover:underline underline-offset-2"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
