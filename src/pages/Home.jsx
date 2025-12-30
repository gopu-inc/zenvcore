import React from 'react';
import { Link } from 'react-router-dom';
import ZenvTerminal from '../components/Terminal';
import { ArrowRight, Download, Box, ShieldCheck, Zap } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-tight mb-6">
              The Package Manager<br />for the Future
            </h1>
            <p className="mt-4 text-xl text-slate-400 max-w-2xl mx-auto">
              Secure, fast, and Python-native package management. 
              Install <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">zenv[core]</code> and start building.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link to="/docs" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2">
                Get Started <ArrowRight size={20} />
              </Link>
              <Link to="/packages" className="bg-slate-800 hover:bg-slate-700 text-white px-8 py-3 rounded-lg font-medium transition-all">
                Browse Packages
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-4 text-sm text-slate-500 font-mono">
                <span className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-green-500">$</span> pip install zenv-lang
                </span>
                <span className="hidden sm:inline">then</span>
                <span className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-full flex items-center gap-2">
                    <span className="text-green-500">$</span> zenv install zenv[core]
                </span>
            </div>
          </div>

          <div className="transform hover:scale-[1.01] transition-transform duration-500">
            <ZenvTerminal />
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
            <div className="absolute top-20 left-10 w-72 h-72 bg-blue-600/20 rounded-full blur-[100px]"></div>
            <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/10 rounded-full blur-[120px]"></div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8">
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                    <div className="bg-blue-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-blue-400">
                        <Box size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Universal Packages</h3>
                    <p className="text-slate-400">Support for .zv archives with a powerful TOML manifest system for dependency management.</p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                    <div className="bg-green-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-green-400">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Secure by Default</h3>
                    <p className="text-slate-400">Private repository integration, token-based authentication, and hash verification.</p>
                </div>
                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                    <div className="bg-purple-900/30 w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-purple-400">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">Fast & Lightweight</h3>
                    <p className="text-slate-400">Built with Python performance in mind. No bloat, just efficient package delivery.</p>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};

export default Home;