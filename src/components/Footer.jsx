import React from 'react';
import { Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                Zenv<span className="text-blue-500">Hub</span>
            </h3>
            <p className="text-slate-500 text-sm mt-2">© 2024 Gopu Inc. Open Source.</p>
          </div>
          
          <div className="flex gap-6">
            <a href="https://github.com/gopu-inc/zenv" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                <Github size={20} />
            </a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <Twitter size={20} />
            </a>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-slate-600">
            Hosted on Cloudflare Pages • API on Render
        </div>
      </div>
    </footer>
  );
};

export default Footer;