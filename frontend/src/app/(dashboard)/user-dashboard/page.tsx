'use client';

import {
  Calendar,
  Check,
  Clock,
  FileText,
  MapPin,
  Plus,
  Search,
  TriangleAlert,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import IssueReportForm from '@/components/IssueReportForm';
import DashboardNav from '@/components/DashboardNav';

export default function UserDashboard() {
  const [open, setOpen] = useState(false);

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
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <Select defaultValue="all">
                  <select className="w-full border rounded-md p-2 bg-white">
                    <option value="all">All Issues</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Date Range
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="mm/dd/yyyy"
                    className="w-full border rounded-md p-2 pr-10"
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
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
              count={12}
            />

            <StatCard
              icon={
                <div className="bg-yellow-100 p-2 rounded-full flex items-center justify-center">
                  <Clock className="text-yellow-500 size-6" />
                </div>
              }
              title="In Progress"
              count={5}
            />

            <StatCard
              icon={
                <div className="bg-green-100 p-2 rounded-full flex items-center justify-center">
                  <Check className="text-green-500 size-6" />
                </div>
              }
              title="Resolved"
              count={4}
            />

            <StatCard
              icon={
                <div className="bg-red-100 p-2 rounded-full flex items-center justify-center">
                  <TriangleAlert className="text-red-500 size-6" />
                </div>
              }
              title="Pending"
              count={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
            <IssueCard
              status="Pending"
              statusColor="red"
              title="Pothole on Main Street"
              location="123 Main St, Downtown"
              reportedDate="Jun 15, 2023"
              description="A large pothole has formed on Main Street, causing damage to vehicles and posing a safety hazard."
            />
            <IssueCard
              status="In Progress"
              statusColor="yellow"
              title="Pothole on Main Street"
              location="123 Main St, Downtown"
              reportedDate="Jun 15, 2023"
              description="A large pothole has formed on Main Street, causing damage to vehicles and posing a safety hazard."
            />
            <IssueCard
              status="Resolved"
              statusColor="green"
              title="Pothole on Main Street"
              location="123 Main St, Downtown"
              reportedDate="Jun 15, 2023"
              description="A large pothole has formed on Main Street, causing damage to vehicles and posing a safety hazard."
            />
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

function IssueCard({
  status,
  statusColor,
  title,
  location,
  reportedDate,
  description,
}: {
  status: string;
  statusColor: 'yellow' | 'green' | 'blue' | 'red';
  title: string;
  location: string;
  reportedDate: string;
  description: string;
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
    <Card className="overflow-hidden py-0">
      <div className="flex items-center justify-between px-4 pt-6">
        <div className="text-md font-semibold">{title}</div>
        <Badge className={`${statusColors[statusColor]}`}>{status}</Badge>
      </div>

      <p className="px-4 text-gray-500">{description}</p>

      <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-100 text-sm text-gray-600">
        <div className="flex items-center gap-0.5 sm:gap-1 ">
          <MapPin /> {location}
        </div>
        <div>Reported: {reportedDate}</div>
      </div>
    </Card>
  );
}
