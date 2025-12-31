import Link from 'next/link';
import { Package, Terminal } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="border-b border-white/10 bg-dark/50 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary hover:text-blue-400 transition">
          <Package className="w-6 h-6" />
          <span>Zenv Hub</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
          <Link href="/packages" className="hover:text-white transition">Packages</Link>
          <Link href="/badges" className="hover:text-white transition">Badges</Link>
          <Link href="https://pypi.org/project/zenv-lang/" target="_blank" className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition">
            <Terminal className="w-4 h-4" />
            <span>Install CLI</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}