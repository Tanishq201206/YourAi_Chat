import React from 'react';
import { useAuth } from '../auth/AuthContext';
import '../CSS/Profile.css';

export default function Profile() {
  const { username, roles, authenticated } = useAuth();

  if (!authenticated) {
    return (
      <div className="profile-root">
        <div className="profile-card">
          <h2>Profile</h2>
          <p className="profile-error">Please login to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-root">
      <div className="profile-card">
        <h2>Your Profile</h2>
        <div className="profile-item">
          <span className="profile-label">Username:</span>
          <span className="profile-value">{username}</span>
        </div>
        <div className="profile-item">
          <span className="profile-label">Roles:</span>
          <span className="profile-value">
            {Array.isArray(roles) ? roles.join(', ') : String(roles || '')}
          </span>
        </div>
      </div>
    </div>
  );
}
