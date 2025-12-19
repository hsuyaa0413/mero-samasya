'use client';

import { Sidebar } from '@/components/sidebar';
import { StatsCards } from '@/components/stats-cards';
import { IssuesByCategory } from '@/components/issues-by-category';
import { PendingApprovals } from '@/components/pending-approvals';
import { ReportedIssues } from '@/components/reported-issues';
import { UserManagement } from '@/components/admin/UserManagement';
import { AuthorityAccounts } from '@/components/admin/AuthorityAccounts';
import { ReportedIssuesManagement } from '@/components/admin/ReportedIssuesManagement';
import { backendApi } from '@/lib/constant';
import { ReportedIssue } from '@/components/IssuedCard';
import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { ScrollArea } from '@/components/ui/scroll-area';

type ViewType =
  | 'dashboard'
  | 'userManagement'
  | 'authorityAccounts'
  | 'reportedIssues';

export default function AdminDashboard() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [reportedIssues, setReportedIssues] = useState<ReportedIssue[]>([]);

  const fetchReportedIssues = useCallback(async () => {
    try {
      console.log('Fetching reported issues at', new Date().toISOString());
      const res = await axios.get(`${backendApi}/report/get-reports`, {
        withCredentials: true,
      });

      if (res.data && Array.isArray(res.data.data)) {
        console.log('Updated reportedIssues:', res.data.data);
        setReportedIssues(res.data.data);
      } else {
        console.error('Expected an array in data, but received:', res.data);
        setReportedIssues([]);
      }
    } catch (error) {
      console.error('Error fetching reported issues:', error);
      setReportedIssues([]);
    }
  }, []);

  useEffect(() => {
    console.log('AdminDashboard mounted');
    fetchReportedIssues();
    return () => console.log('AdminDashboard unmounted');
  }, [fetchReportedIssues]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="absolute left-2/12 w-10/12">
        <div className="flex-1">
          <header className="bg-lightBlue p-4 flex justify-between items-center sticky top-0 z-10 px-10 h-18 border-b border-gray-300">
            <h1 className="text-2xl font-bold text-darkBlue">
              Admin Dashboard
            </h1>
          </header>

          <main className="p-6 px-10" suppressHydrationWarning>
            {currentView === 'dashboard' && (
              <>
                <StatsCards reportedIssues={reportedIssues} />

                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                  <div className="flex flex-col space-y-6">
                    <div className="flex flex-col border-1 rounded-lg shadow-sm bg-white">
                      <h2 className="text-lg font-semibold border-b p-4 bg-gray-100">
                        Issues by Category (All Time)
                      </h2>
                      <IssuesByCategory reportedIssues={reportedIssues} />
                    </div>

                    <div className="shadow-sm rounded-lg border-1">
                      <h2 className="text-lg font-semibold p-4 pl-6 border-b bg-gray-100">
                        Pending Authority Approvals
                      </h2>
                      <ScrollArea className="h-[320px] px-4 inset-x-0">
                        <PendingApprovals />
                      </ScrollArea>
                    </div>
                  </div>

                  <div className="shadow-sm rounded-lg border-1">
                    <h2 className="text-lg font-semibold p-4 pl-6 border-b bg-gray-100">
                      Recent Reported Issues
                    </h2>
                    <ScrollArea className="h-[calc(100vh + 10px)] px-4 inset-x-0">
                      <ReportedIssues
                        reportedIssues={reportedIssues}
                        fetchReportedIssues={fetchReportedIssues}
                      />
                    </ScrollArea>
                  </div>
                </div>
              </>
            )}

            {currentView === 'userManagement' && <UserManagement />}

            {currentView === 'authorityAccounts' && <AuthorityAccounts />}

            {currentView === 'reportedIssues' && <ReportedIssuesManagement />}
          </main>
        </div>
      </div>
    </div>
  );
}
