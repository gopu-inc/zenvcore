'use client';
import { useState } from 'react';
import CopyButton from '@/components/CopyButton';

export default function BadgesPage() {
  const [label, setLabel] = useState('zenv');
  const [value, setValue] = useState('package');
  const [color, setColor] = useState('blue');
  const [style, setStyle] = useState('flat');

  const badgeUrl = `https://zenv-hub.onrender.com/badge/shields/${label || 'label'}/${value || 'value'}/${color}/${'zenv'}/${style}`;
  const mdCode = `![${label}](${badgeUrl})`;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Générateur de Badges</h1>
      
      <div className="bg-white/5 border border-white/10 rounded-xl p-8">
        <div className="flex justify-center mb-10 min-h-[60px] items-center bg-black/30 rounded-lg border border-white/5 border-dashed">
            <img src={badgeUrl} alt="Badge Preview" className="h-8" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Label (gauche)</label>
                <input 
                    type="text" 
                    value={label} 
                    onChange={(e) => setLabel(e.target.value)}
                    className="w-full bg-dark border border-white/20 rounded p-2 focus:border-primary outline-none"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Valeur (droite)</label>
                <input 
                    type="text" 
                    value={value} 
                    onChange={(e) => setValue(e.target.value)}
                    className="w-full bg-dark border border-white/20 rounded p-2 focus:border-primary outline-none"
                />
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Couleur</label>
                <select 
                    value={color} 
                    onChange={(e) => setColor(e.target.value)}
                    className="w-full bg-dark border border-white/20 rounded p-2 outline-none"
                >
                    <option value="blue">Bleu</option>
                    <option value="green">Vert</option>
                    <option value="red">Rouge</option>
                    <option value="orange">Orange</option>
                    <option value="purple">Violet</option>
                    <option value="gray">Gris</option>
                </select>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Style</label>
                <select 
                    value={style} 
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full bg-dark border border-white/20 rounded p-2 outline-none"
                >
                    <option value="flat">Flat</option>
                    <option value="plastic">Plastic</option>
                    <option value="for-the-badge">For the Badge</option>
                    <option value="flat-square">Flat Square</option>
                </select>
            </div>
        </div>

        <div className="relative bg-black p-4 rounded-lg border border-white/10">
            <p className="text-xs text-gray-500 mb-2">Markdown pour GitHub:</p>
            <code className="text-blue-300 break-all">{mdCode}</code>
            <CopyButton text={mdCode} />
        </div>
      </div>
    </div>
  );
}