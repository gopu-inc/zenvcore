import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Terminal, Package, Book, Shield, User } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem('zenv_token');

  const navLinks = [
    { name: 'Packages', path: '/packages', icon: <Package size={18} /> },
    { name: 'Badges', path: '/badges', icon: <Shield size={18} /> },
    { name: 'Docs', path: '/docs', icon: <Book size={18} /> },
  ];

  return (
    <nav className="bg-zenv-dark/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <div className="bg-blue-600 p-1.5 rounded-md">
                <Terminal size={20} className="text-white" />
            </div>
            <span>Zenv<span className="text-blue-500">Hub</span></span>
          </Link>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    location.pathname === link.path
                      ? 'bg-slate-800 text-blue-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:block">
            {token ? (
                <Link to="/profile" className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2">
                    <User size={16} /> Profile
                </Link>
            ) : (
                <div className="flex gap-2">
                    <Link to="/login" className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">Login</Link>
                    <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">Sign Up</Link>
                </div>
            )}
          </div>

          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="bg-slate-800 p-2 rounded-md text-slate-400 hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-slate-800 block px-3 py-2 rounded-md text-base font-medium flex items-center gap-2"
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
             <div className="border-t border-slate-800 pt-2 mt-2">
                {token ? (
                     <Link to="/profile" className="text-slate-300 block px-3 py-2">Profile</Link>
                ) : (
                    <>
                        <Link to="/login" className="text-slate-300 block px-3 py-2">Login</Link>
                        <Link to="/register" className="text-blue-400 block px-3 py-2 font-bold">Sign Up</Link>
                    </>
                )}
             </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;