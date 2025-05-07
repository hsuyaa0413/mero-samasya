import { Sidebar } from '@/components/sidebar';
import { StatsCards } from '@/components/stats-cards';
import { IssuesByCategory } from '@/components/issues-by-category';
import { UserActivity } from '@/components/user-activity';
import { PendingApprovals } from '@/components/pending-approvals';
import { ReportedIssues } from '@/components/reported-issues';

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="absolute left-2/12 w-10/12">
        <div className="flex-1">
          <header className="bg-lightBlue p-4 border-b flex justify-between items-center sticky top-0 z-10 px-10 h-18">
            <h1 className="text-xl font-bold text-darkBlue">Admin Dashboard</h1>
          </header>

          <main className="p-6 px-10">
            <StatsCards />

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col border-1 rounded-lg shadow-sm px-4 bg-white">
                <h2 className="text-lg font-semibold pt-6 px-4">
                  Issues by Category (This month)
                </h2>
                <IssuesByCategory />
              </div>

              <div className="flex flex-col border-1 rounded-lg shadow-sm px-4 bg-white">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold pt-6 px-4">
                    User Activity
                  </h2>
                </div>
                <UserActivity />
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="flex flex-col border-1 rounded-lg shadow-sm px-4 bg-white">
                <h2 className="mb-4 text-lg font-semibold p-4">
                  Pending Authority Approvals
                </h2>
                <PendingApprovals />
              </div>

              <div className="flex flex-col border-1 rounded-lg shadow-sm px-4 bg-white">
                <h2 className="mb-4 text-lg font-semibold p-4">
                  Recent Reported Issues
                </h2>
                <ReportedIssues />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
