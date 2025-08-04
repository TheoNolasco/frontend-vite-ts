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
    <div className="min-h-screen bg-base-200">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="flex-1">
          <h1 className="text-xl font-bold">My App</h1>
        </div>
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full bg-primary text-primary-content flex items-center justify-center">
                {session.user.name.charAt(0).toUpperCase()}
              </div>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
              <li><span className="text-sm font-medium">{session.user.name}</span></li>
            </ul>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <UserProfile />
          </div>

          <div className="space-y-6">
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-2xl mb-4">Dashboard</h2>
                <p className="text-base-content/70 mb-6">
                  Welcome to your dashboard! You're successfully authenticated with Better Auth.
                </p>

                <div className="space-y-4">
                  <div className="alert alert-info">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <div>
                      <h3 className="font-bold">Session Info</h3>
                      <div className="text-xs">Expires: {new Date(session.session.expiresAt).toLocaleString()}</div>
                    </div>
                  </div>

                  <div className="alert alert-success">
                    <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-bold">Authentication Status</h3>
                      <div className="text-xs">Successfully authenticated with Better Auth</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Quick Actions</h2>
                <div className="card-actions justify-end">
                  <button className="btn btn-primary">View Properties</button>
                  <button className="btn btn-secondary">Add Property</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
