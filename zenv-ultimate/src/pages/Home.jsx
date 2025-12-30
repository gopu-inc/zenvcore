import React from 'react';
import XTerminal from '../components/Terminal';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <div className="text-center pt-20 pb-10 px-4">
                <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">ZENV PROTOCOL</h1>
                <p className="text-gray-400 text-xl max-w-2xl mx-auto mb-10">
                    Next-generation package manager for Python. Secure, Fast, and Binary-optimized.
                </p>
                <div className="flex justify-center gap-4 mb-16">
                    <Link to="/packages" className="bg-blue-600 px-8 py-3 rounded-lg font-bold hover:bg-blue-700">Explore Hub</Link>
                    <Link to="/docs" className="border border-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-800">Read Docs</Link>
                </div>
            </div>
            
            <div className="max-w-4xl mx-auto px-4 mb-20">
                <div className="bg-[#0a0a0a] rounded-lg border border-gray-800 overflow-hidden shadow-2xl h-[400px]">
                    <div className="bg-[#1e1e1e] px-4 py-2 border-b border-gray-800 flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className="h-full p-2">
                        <XTerminal />
                    </div>
                </div>
                <p className="text-center text-gray-600 text-sm mt-4">Interactive Web Terminal • Try typing <span className="text-green-500">pip install zenv-lang</span></p>
            </div>
        </div>
    );
};
export default Home;