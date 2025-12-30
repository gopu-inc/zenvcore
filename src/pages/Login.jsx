import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
    const [form, setForm] = useState({username:'', password:''});
    const { login } = useAuth();
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            const res = await AuthService.login(form);
            login(res.data.token.access_token, res.data.user);
            toast.success('Welcome!');
            navigate('/dashboard');
        } catch { toast.error('Login failed'); }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={submit} className="bg-card border border-border p-8 rounded-xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Login</h1>
                <input className="w-full bg-black/50 border border-border p-3 rounded" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
                <input type="password" className="w-full bg-black/50 border border-border p-3 rounded" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
                <button className="w-full bg-primary p-3 rounded font-bold hover:bg-blue-600">Log In</button>
                <p className="text-center text-sm text-gray-500">No account? <Link to="/register" className="text-primary">Sign up</Link></p>
            </form>
        </div>
    );
};
export default Login;