'use client';

import {
  Check,
  Clock,
  FileText,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import IssueReportForm from '@/components/IssueReportForm';
import DashboardNav from '@/components/DashboardNav';
import { backendApi } from '@/lib/constant';
import IssuedCard, { ReportedIssue } from '@/components/IssuedCard';
import axios from 'axios';

export default function UserDashboard() {
  const [open, setOpen] = useState(false);
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [visibleCount, setVisibleCount] = useState(6);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  async function fetchReportedIssues() {
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
  }

  useEffect(() => {
    fetchReportedIssues();
  }, []);

  const totalReports = reportedIssues.length;
  const inProgressCount = reportedIssues.filter(
    r => r.status === 'inProgress'
  ).length;
  const resolvedCount = reportedIssues.filter(
    r => r.status === 'resolved'
  ).length;
  const pendingCount = reportedIssues.filter(
    r => r.status === 'pending'
  ).length;
  const filteredIssues =
    selectedStatus === 'all'
      ? reportedIssues
      : reportedIssues.filter(issue => issue.status === selectedStatus);

  const searchedIssues = filteredIssues
    .filter(
      issue =>
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(issue => {
      if (!selectedDate) return true;

      const issueDate = new Date(issue.updatedAt);
      const selected = new Date(selectedDate);

      return (
        issueDate.getFullYear() === selected.getFullYear() &&
        issueDate.getMonth() === selected.getMonth() &&
        issueDate.getDate() === selected.getDate()
      );
    });

  const handleShowMore = () => {
    setVisibleCount(prevCount => prevCount + 9);
  };

  return (
    <>
      <DashboardNav />
      <div className="text-darkBlue min-h-screen bg-gray-100">
        <div className="container max-w-7xl mx-auto py-8 px-4">
          <div className="flex flex-row justify-between items-end gap-10 mb-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-darkBlue">
                Citizen Dashboard
              </h1>
              <p className="text-sm text-gray-600">
                Track and manage your reported issues
              </p>
            </div>
            <Button
              onClick={() => setOpen(true)}
              className="bg-red-200 text-red-900 hover:bg-red-300 mt-4 md:mt-0 cursor-pointer"
            >
              <Plus /> Report an Issue
            </Button>
          </div>

          <Card className="mt-6 p-4 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="">
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  className="w-full border rounded-md p-2  bg-white"
                  value={selectedStatus}
                  onChange={e => setSelectedStatus(e.target.value)}
                >
                  <option value="all">All Issues</option>
                  <option value="pending">Pending</option>
                  <option value="inProgress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full border rounded-md p-2 pr-10"
                    value={selectedDate}
                    onChange={e => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="w-full max-w-md mx-auto">
                <label className="block text-sm font-medium mb-2">Search</label>
                <div className="relative w-full">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search by title or description"
                    className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md"
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
            <StatCard
              icon={
                <div className="bg-blue-100 p-2 rounded-full flex items-center justify-center">
                  <FileText className="text-blue-500 size-6" />
                </div>
              }
              title="Total Reports"
              count={totalReports}
            />

            <StatCard
              icon={
                <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-500 size-6" />
                </div>
              }
              title="In Progress"
              count={inProgressCount}
            />

            <StatCard
              icon={
                <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                  <Check className="text-green-500 size-6" />
                </div>
              }
              title="Resolved"
              count={resolvedCount}
            />

            <StatCard
              icon={
                <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
                  <TriangleAlert className="text-red-500 size-6" />
                </div>
              }
              title="Pending"
              count={pendingCount}
            />
          </div>
          <div className="mt-7">
            <h1 className="text-darkBlue font-bold text-xl mb-3 pl-2">
              Recent Reported Issues:
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchedIssues.length > 0 ? (
                <>
                  {[...searchedIssues]
                    .sort(
                      (a, b) =>
                        new Date(b.updatedAt).getTime() -
                        new Date(a.updatedAt).getTime()
                    )
                    .slice(0, visibleCount) // 👈 only show up to `visibleCount`
                    .map(issuedReports => (
                      <IssuedCard
                        key={issuedReports._id}
                        issuedReports={issuedReports}
                      />
                    ))}

                  {/* Show More Button */}
                  {visibleCount < searchedIssues.length && (
                    <div className="col-span-full flex justify-center mt-4">
                      <Button
                        onClick={handleShowMore}
                        className="bg-blue-200 text-blue-900 hover:bg-blue-300 cursor-pointer"
                      >
                        Show More
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="px-4 py-2 text-gray-500">
                  No reports found !
                </div>
              )}
            </div>
          </div>

          <IssueReportForm open={open} setOpen={setOpen} />
        </div>
      </div>
    </>
  );
}

function StatCard({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count: number;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        {icon}
        <div>
          <p className="text-xs sm:text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold">{count}</p>
        </div>
      </CardContent>
    </Card>
  );
}
