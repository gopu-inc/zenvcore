import React, { useState } from 'react';
import { AuthService } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
    const [form, setForm] = useState({username:'', email:'', password:''});
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        try {
            await AuthService.register(form);
            toast.success('Account created! Login now.');
            navigate('/login');
        } catch { toast.error('Registration failed'); }
    };

    return (
        <div className="flex justify-center items-center min-h-[80vh]">
            <form onSubmit={submit} className="bg-card border border-border p-8 rounded-xl w-full max-w-md space-y-4">
                <h1 className="text-2xl font-bold text-center">Register</h1>
                <input className="w-full bg-black/50 border border-border p-3 rounded" placeholder="Username" value={form.username} onChange={e=>setForm({...form, username:e.target.value})} />
                <input type="email" className="w-full bg-black/50 border border-border p-3 rounded" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
                <input type="password" className="w-full bg-black/50 border border-border p-3 rounded" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} />
                <button className="w-full bg-white text-black p-3 rounded font-bold hover:bg-gray-200">Sign Up</button>
                <p className="text-center text-sm text-gray-500">Have account? <Link to="/login" className="text-primary">Login</Link></p>
            </form>
        </div>
    );
};
export default Register;