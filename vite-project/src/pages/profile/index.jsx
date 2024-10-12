import { UseAppStore } from '@/store'; // Make sure to import the store
import React, { useEffect } from 'react';

export default function Profile() {
  const { userInfo } = UseAppStore();

  // Log userInfo for debugging
  useEffect(() => {
    console.log('userInfo:', userInfo);
  }, [userInfo]);

  return (
    <div>
      <h1>Profile</h1>
      
  {userInfo ? (
    <div>
      <p>Email: {userInfo.email}</p>
      <p>First Name: {userInfo.firstName}</p>
      <p>Last Name: {userInfo.lastName}</p>
      <p>Phone: {userInfo.phone}</p>
    </div>
  ) : (
    <p>No user information available.</p>
  )}
    </div>
  );
}
