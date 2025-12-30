import React from 'react';
import { Link } from 'react-router-dom';
import ZenvTerminal from '../components/Terminal';
import { ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="pb-20">
      <section className="pt-20 pb-12 text-center px-4">
        <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500">
          The Python-Native<br/>Package Manager
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
          Secure, fast, and built for modern development. Install zenv-lang and zenv[core] to get started.
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Link to="/docs" className="bg-white text-black px-6 py-3 rounded-lg font-bold flex items-center gap-2">
            Get Started <ArrowRight size={18} />
          </Link>
          <Link to="/packages" className="bg-card border border-border px-6 py-3 rounded-lg font-bold">
            Browse Hub
          </Link>
        </div>
        
        <div className="max-w-3xl mx-auto text-left">
            <div className="flex gap-2 mb-2 px-2 text-xs text-gray-500">
               Try: <span className="text-primary">pip install zenv-lang</span> inside the terminal below
            </div>
            <ZenvTerminal />
        </div>
      </section>
    </div>
  );
};
export default Home;