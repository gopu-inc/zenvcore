import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {Menu, X, Terminal} from 'lucide-react';
export default function Navbar() {
    const {user} = useAuth();
    const [isOpen, setOpen] = useState(false);
    return (
        <nav className="border-b border-gray-800 bg-black/80 backdrop-blur sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
                <Link to="/" className="font-bold text-xl flex items-center gap-2"><Terminal className="text-green-500"/> ZenvHub</Link>
                <div className="hidden md:flex gap-6 items-center">
                    <Link to="/packages" className="hover:text-blue-400">Packages</Link>
                    <Link to="/docs" className="hover:text-blue-400">Docs</Link>
                    {user ? <Link to="/dashboard" className="text-blue-400">Dashboard</Link> : <Link to="/login" className="bg-white text-black px-4 py-2 rounded font-bold">Login</Link>}
                </div>
                <button onClick={()=>setOpen(!isOpen)} className="md:hidden text-white"><Menu/></button>
            </div>
            {isOpen && <div className="md:hidden bg-gray-900 p-4 space-y-4 border-b border-gray-800">
                <Link to="/packages" className="block">Packages</Link>
                <Link to="/login" className="block">Login</Link>
            </div>}
        </nav>
    );
}