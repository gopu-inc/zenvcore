import React, {useEffect, useState} from 'react';
import {PackageService} from '../services/api';
import {Link} from 'react-router-dom';
import {Box} from 'lucide-react';
export default function Packages() {
    const [pkgs, setPkgs] = useState([]);
    useEffect(()=>{PackageService.getAll().then(r=>setPkgs(r.data.packages||[]))},[]);
    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-8">Packages Index</h1>
            <div className="grid md:grid-cols-3 gap-4">
                {pkgs.map(p=>(
                    <Link key={p.name} to={`/packages/${p.name}`} className="bg-[#18181b] p-6 rounded-xl border border-gray-800 hover:border-blue-500">
                        <div className="flex items-center gap-2 mb-2 text-xl font-bold"><Box className="text-blue-500"/> {p.name}</div>
                        <p className="text-gray-400 text-sm">{p.description}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}