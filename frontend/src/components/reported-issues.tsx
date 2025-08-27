'use client';

import { Badge } from '@/components/ui/badge';
import timeAgo from '@/lib/timeAgo';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Camera,
  CheckCircle,
  CircleAlert,
  FileText,
  Flag,
  Flame,
  Mail,
  MapPin,
  Phone,
  User,
  XCircle,
} from 'lucide-react';
import { ReportedIssue } from './IssuedCard';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { useState } from 'react';
import Image from 'next/image';
import { backendApi } from '@/lib/constant';
import axios from 'axios';

export function ReportedIssues({
  reportedIssues,
  fetchReportedIssues,
}: {
  reportedIssues: ReportedIssue[];
  fetchReportedIssues: () => Promise<void>;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [issue, setIssue] = useState<ReportedIssue | null>(null);
  const [isUrgentConfirmOpen, setIsUrgentConfirmOpen] = useState(false);
  const [isRejectConfirmOpen, setIsRejectConfirmOpen] = useState(false);

  const handleViewDetails = (id: string) => {
    const issue = reportedIssues.find(issue => issue._id === id);
    if (issue) {
      setIssue(issue);
      setIsDialogOpen(true);
    }
  };

  const handleMarkUrgent = async (id: string | undefined) => {
    try {
      console.log('Marking issue as urgent:', id);
      const res = await axios.get(`${backendApi}/report/mark-urgent/${id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log('Issue marked as urgent, fetching updated issues');
        setIsDialogOpen(false);
        setIsUrgentConfirmOpen(false);
        await fetchReportedIssues();
      }
    } catch (e) {
      console.error('Error marking issue as urgent:', e);
    }
  };

  const handleReject = async (id: string | undefined) => {
    try {
      console.log('Rejecting issue:', id);
      const res = await axios.get(`${backendApi}/report/reject-issue/${id}`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        console.log('Issue rejected, fetching updated issues');
        setIsDialogOpen(false);
        setIsRejectConfirmOpen(false);
        await fetchReportedIssues();
      }
    } catch (e) {
      console.error('Error rejecting issue:', e);
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
            Reported by: {issue.reportedBy?.fullName}
          </p>
          <p className="my-1 text-sm">{issue.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {timeAgo(new Date(issue.createdAt))}
            </span>
            <button
              className="text-blue-600 text-sm cursor-pointer hover:underline underline-offset-3"
              onClick={() => handleViewDetails(issue._id)}
            >
              View Details
            </button>
          </div>
        </div>
      ))}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-orange-500" />
              Issue Details - #{issue?._id}
            </DialogTitle>
            <DialogDescription>
              Manage and track the resolution of this reported issue
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold">{issue?.title}</h3>
                  <div className="flex gap-2">
                    <Badge
                      className={`${getStatusColor(issue?.status)} capitalize`}
                    >
                      {issue?.status === 'inProgress'
                        ? 'In Progress'
                        : issue?.status}
                    </Badge>
                    <Badge
                      className={`${getUrgencyColor(
                        issue?.urgency
                      )} capitalize`}
                    >
                      {getUrgencyIcon(issue?.urgency)}
                      {issue?.urgency}
                    </Badge>
                  </div>
                </div>

                <p className="text-gray-600">{issue?.description}</p>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{issue?.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>{issue?.createdAt.split('T')[0]}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span>Category: {issue?.category}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {issue?.mediaUrls && issue?.mediaUrls.length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Attached Images
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {issue?.mediaUrls.map((image, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                      >
                        <Image
                          src={image}
                          alt={`Issue image - ${issue?._id}`}
                          className="w-full h-full object-cover"
                          width={300}
                          height={200}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Reporter Information
                </h4>
                <div className="space-y-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`https://avatar.iran.liara.run/public/${
                          Math.floor(Math.random() * 100) + 1
                        }`}
                        alt={issue?.reportedBy?.fullName}
                      />
                      <AvatarFallback>
                        {issue?.reportedBy?.fullName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {issue?.reportedBy?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {issue?.reportedBy?.role}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-gray-500" />
                      <span>{issue?.reportedBy?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-gray-500" />
                      <span>{issue?.reportedBy?.phoneNumber}</span>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <h4 className="font-medium">Quick Actions</h4>
                <div className="grid grid-cols-1 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="cursor-pointer"
                    onClick={() => setIsUrgentConfirmOpen(true)}
                  >
                    <Flag className="h-4 w-4 mr-2" />
                    Mark as Urgent
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700 bg-transparent cursor-pointer"
                    onClick={() => setIsRejectConfirmOpen(true)}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject Issue
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Dialog
            open={isUrgentConfirmOpen}
            onOpenChange={setIsUrgentConfirmOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Mark as Urgent</DialogTitle>
                <DialogDescription>
                  Are you sure you want to mark this issue as urgent?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsUrgentConfirmOpen(false)}
                >
                  No
                </Button>
                <Button onClick={() => handleMarkUrgent(issue?._id)}>
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog
            open={isRejectConfirmOpen}
            onOpenChange={setIsRejectConfirmOpen}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirm Reject Issue</DialogTitle>
                <DialogDescription>
                  Are you sure you want to reject this issue?
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsRejectConfirmOpen(false)}
                >
                  No
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(issue?._id)}
                >
                  Yes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>
    </div>
  );
}
