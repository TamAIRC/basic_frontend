'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { InputText } from 'primereact/inputtext';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string;
  createdAt: string;
}

const UserAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.replace('/auth/login');
          return;
        }

        const response = await axios.get<User>('http://localhost:8080/auth/me', {
          headers: {
            Authorization: `${token}`,
          },
        });

        setUser(response.data);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="grid">
      <div className="col-12 md:col-6">
        <div className="card p-fluid">
          <h5>User Account</h5>
          <div className="field">
            <label htmlFor="name1">Name</label>
            <InputText id="name1" type="text" value={user?.username || ''} readOnly />
          </div>
          <div className="field">
            <label htmlFor="email1">Email</label>
            <InputText id="email1" type="text" value={user?.email || ''} readOnly />
          </div>
          <div className="field">
            <label htmlFor="role1">Role</label>
            <InputText id="role1" type="text" value={user?.roles || ''} readOnly />
          </div>
          <div className="field">
            <label htmlFor="createdAt1">Created At</label>
            <InputText id="createdAt1" type="text" value={user?.createdAt || ''} readOnly />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
