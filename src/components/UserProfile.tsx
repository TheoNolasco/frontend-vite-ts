import React from 'react';
import { useSession, signOut } from '../lib/auth';

export const UserProfile: React.FC = () => {
  const { data: session, isPending } = useSession();

  const handleSignOut = async () => {
    await signOut();
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center p-8">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-2xl">Profile</h2>
          <button
            onClick={handleSignOut}
            className="btn btn-error btn-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="label">
              <span className="label-text font-medium">Name</span>
            </div>
            <p className="text-base-content">{session.user.name}</p>
          </div>

          <div>
            <div className="label">
              <span className="label-text font-medium">Email</span>
            </div>
            <p className="text-base-content">{session.user.email}</p>
          </div>

          <div>
            <div className="label">
              <span className="label-text font-medium">Email Verified</span>
            </div>
            <div className="badge badge-outline">
              {session.user.emailVerified ? '✅ Verified' : '❌ Not verified'}
            </div>
          </div>

          <div>
            <div className="label">
              <span className="label-text font-medium">Account Created</span>
            </div>
            <p className="text-base-content">
              {new Date(session.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
