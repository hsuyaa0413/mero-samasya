'use client';

import { ReportedIssue } from '@/components/IssuedCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import timeAgo from '@/lib/timeAgo';
import {
  AlertCircle,
  CheckCircle,
  CircleAlert,
  Flame,
  Search,
  FolderTree,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { backendApi } from '@/lib/constant';
import axios from 'axios';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Image from 'next/image';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const CATEGORIES = [
  { value: 'water', label: 'Water', icon: '💧' },
  { value: 'road', label: 'Road', icon: '🛣️' },
  { value: 'electricity', label: 'Electricity', icon: '⚡' },
  { value: 'waste_sanitation', label: 'Waste & Sanitation', icon: '🗑️' },
  { value: 'others', label: 'Others', icon: '📋' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'pending', label: 'Pending' },
  { value: 'inProgress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
];

const URGENCY_OPTIONS = [
  { value: 'all', label: 'All Urgency' },
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export function ReportedIssuesManagement() {
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUrgency, setSelectedUrgency] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedIssue, setSelectedIssue] = useState<ReportedIssue | null>(
    null
  );

  const fetchReportedIssues = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${backendApi}/report/get-reports`, {
        withCredentials: true,
      });

      if (res.data && Array.isArray(res.data.data)) {
        setReportedIssues(res.data.data);
      } else {
        console.error('Expected an array in data, but received:', res.data);
        setReportedIssues([]);
      }
    } catch (error) {
      console.error('Error fetching reported issues:', error);
      setReportedIssues([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportedIssues();
  }, []);

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

  const filteredIssues = useMemo(() => {
    return reportedIssues.filter(issue => {
      const matchesCategory =
        selectedCategory === 'all' || issue.category === selectedCategory;
      const matchesStatus =
        selectedStatus === 'all' || issue.status === selectedStatus;
      const matchesUrgency =
        selectedUrgency === 'all' || issue.urgency === selectedUrgency;
      const matchesSearch =
        searchQuery === '' ||
        issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        issue.location.toLowerCase().includes(searchQuery.toLowerCase());

      return (
        matchesCategory && matchesStatus && matchesUrgency && matchesSearch
      );
    });
  }, [
    reportedIssues,
    selectedCategory,
    selectedStatus,
    selectedUrgency,
    searchQuery,
  ]);

  const handleViewDetails = (issue: ReportedIssue) => {
    setSelectedIssue(issue);
    setIsDialogOpen(true);
  };

  // Group issues by category
  const issuesByCategory = useMemo(() => {
    const grouped: Record<string, ReportedIssue[]> = {};
    CATEGORIES.forEach(cat => {
      grouped[cat.value] = filteredIssues.filter(
        issue => issue.category === cat.value
      );
    });
    return grouped;
  }, [filteredIssues]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading issues...</div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Reported Issues
            </h2>
            <p className="text-gray-600">
              Manage all reported issues across categories
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <FolderTree className="w-5 h-5" />
            <span className="font-semibold">
              {filteredIssues.length} Issues
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map(cat => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger>
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedUrgency} onValueChange={setSelectedUrgency}>
            <SelectTrigger>
              <SelectValue placeholder="All Urgency" />
            </SelectTrigger>
            <SelectContent>
              {URGENCY_OPTIONS.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Issues grouped by category */}
        {selectedCategory === 'all' ? (
          <div className="space-y-8">
            {CATEGORIES.map(category => {
              const issues = issuesByCategory[category.value] || [];
              if (issues.length === 0) return null;

              return (
                <div
                  key={category.value}
                  className="bg-white rounded-lg shadow-md border border-gray-200"
                >
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200 rounded-t-lg">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      {category.icon} {category.label}
                      <Badge className="ml-2 bg-blue-200 text-blue-800">
                        {issues.length}
                      </Badge>
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    {issues.map(issue => (
                      <div
                        key={issue._id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {issue.title}
                          </h4>
                          <div className="flex gap-2">
                            <Badge className={getUrgencyColor(issue.urgency)}>
                              {getUrgencyIcon(issue.urgency)}
                              {issue.urgency}
                            </Badge>
                            <Badge className={getStatusColor(issue.status)}>
                              {issue.status === 'inProgress'
                                ? 'In Progress'
                                : issue.status}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {issue.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📍 {issue.location}</span>
                            <span>⏰ {timeAgo(new Date(issue.createdAt))}</span>
                            <span>👤 {issue.reportedBy?.fullName}</span>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(issue)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 border-b border-gray-200 rounded-t-lg">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {CATEGORIES.find(c => c.value === selectedCategory)?.icon}{' '}
                {CATEGORIES.find(c => c.value === selectedCategory)?.label}
                <Badge className="ml-2 bg-blue-200 text-blue-800">
                  {filteredIssues.length}
                </Badge>
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {filteredIssues.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No issues found in this category
                </div>
              ) : (
                filteredIssues.map(issue => (
                  <div
                    key={issue._id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {issue.title}
                      </h4>
                      <div className="flex gap-2">
                        <Badge className={getUrgencyColor(issue.urgency)}>
                          {getUrgencyIcon(issue.urgency)}
                          {issue.urgency}
                        </Badge>
                        <Badge className={getStatusColor(issue.status)}>
                          {issue.status === 'inProgress'
                            ? 'In Progress'
                            : issue.status}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📍 {issue.location}</span>
                        <span>⏰ {timeAgo(new Date(issue.createdAt))}</span>
                        <span>👤 {issue.reportedBy?.fullName}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(issue)}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Issue Details Dialog */}
      {selectedIssue && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="min-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-orange-500" />
                Issue Details - #{selectedIssue._id}
              </DialogTitle>
              <DialogDescription>
                View complete information about this reported issue
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold">
                      {selectedIssue.title}
                    </h3>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(selectedIssue.status)}>
                        {selectedIssue.status === 'inProgress'
                          ? 'In Progress'
                          : selectedIssue.status}
                      </Badge>
                      <Badge className={getUrgencyColor(selectedIssue.urgency)}>
                        {getUrgencyIcon(selectedIssue.urgency)}
                        {selectedIssue.urgency}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-600">{selectedIssue.description}</p>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Location:</span>
                      <span>{selectedIssue.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Category:</span>
                      <span className="capitalize">
                        {selectedIssue.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Reported:</span>
                      <span>
                        {new Date(selectedIssue.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Last Updated:</span>
                      <span>
                        {new Date(selectedIssue.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {selectedIssue.mediaUrls &&
                  selectedIssue.mediaUrls.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="font-medium">Attached Images</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {selectedIssue.mediaUrls.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                          >
                            <Image
                              src={image}
                              alt={`Issue image ${index + 1}`}
                              width={400}
                              height={400}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              <div className="space-y-6">
                <Separator className="lg:hidden" />
                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                  <h4 className="font-semibold">Reporter Information</h4>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src="https://avatar.iran.liara.run/public/job/user/male" />
                      <AvatarFallback className="bg-blue-100 text-blue-700">
                        {selectedIssue.reportedBy?.fullName
                          .split(' ')
                          .map(n => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        {selectedIssue.reportedBy?.fullName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {selectedIssue.reportedBy?.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
