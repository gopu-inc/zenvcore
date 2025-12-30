import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Menu, X, Terminal, Package, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-bg/80 backdrop-blur border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="/favicon.ico" className="w-8 h-8 rounded" alt="Logo" />
          Zenv<span className="text-primary">Hub</span>
        </Link>
        
        <div className="hidden md:flex gap-6 items-center">
          <Link to="/packages" className="hover:text-primary">Packages</Link>
          <Link to="/docs" className="hover:text-primary">Docs</Link>
          <Link to="/badges" className="hover:text-primary">Badges</Link>
          {user ? (
            <Link to="/dashboard" className="bg-primary/10 text-primary px-4 py-2 rounded-full">Dashboard</Link>
          ) : (
            <Link to="/login" className="bg-white text-black px-4 py-2 rounded-lg font-bold">Login</Link>
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden bg-card p-4 space-y-4 border-b border-border">
          <Link to="/packages" className="block" onClick={() => setIsOpen(false)}>Packages</Link>
          <Link to="/docs" className="block" onClick={() => setIsOpen(false)}>Docs</Link>
          {user ? (
             <Link to="/dashboard" className="block text-primary" onClick={() => setIsOpen(false)}>Dashboard</Link>
          ) : (
             <Link to="/login" className="block text-primary" onClick={() => setIsOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  );
};
export default Navbar;