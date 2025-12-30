import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LogOut, Key, User } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [token, setToken] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const genToken = async () => {
    try {
        const res = await AuthService.generateToken();
        setToken(res.data.token);
        toast.success('Token Generated');
    } catch { toast.error('Error'); }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <button onClick={handleLogout} className="flex items-center gap-2 text-red-400 border border-red-500/30 px-4 py-2 rounded hover:bg-red-500/10"><LogOut size={16}/> Logout</button>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border border-border p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><User size={20}/> Profile</h2>
                <p>Username: <span className="text-gray-400">{user.username}</span></p>
                <p>Email: <span className="text-gray-400">{user.email}</span></p>
                <p>Role: <span className="text-primary">{user.role}</span></p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Key size={20}/> API Token</h2>
                {!token ? (
                    <button onClick={genToken} className="bg-primary hover:bg-blue-600 text-white px-4 py-2 rounded w-full">Generate New Token</button>
                ) : (
                    <div className="bg-black/50 p-4 rounded border border-green-500/50">
                        <p className="text-green-400 text-sm mb-2">Copy this token (shown once):</p>
                        <code className="break-all font-mono text-sm">{token}</code>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};
export default Dashboard;