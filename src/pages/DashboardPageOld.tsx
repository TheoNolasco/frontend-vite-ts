import React from 'react';
import { UserProfile } from '../components/UserProfile';
import { useSession } from '../lib/auth';
import { Navigate } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="min-h-screen bg-base-200 flex justify-center items-center">
        <div className="text-center">
          <span className="loading loading-spinner loading-lg mb-4"></span>
          <p className="text-base-content/70">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">My App</h1>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-4">
                Welcome, {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <UserProfile />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
              <p className="text-gray-600 mb-4">
                Welcome to your dashboard! You're successfully authenticated.
              </p>

              <div className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900">Quick Stats</h3>
                  <p className="text-blue-700 text-sm mt-1">
                    Session expires: {new Date(session.session.expiresAt).toLocaleString()}
                  </p>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-medium text-green-900">Authentication Status</h3>
                  <p className="text-green-700 text-sm mt-1">
                    ✅ Successfully authenticated with Better Auth
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
