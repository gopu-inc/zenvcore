import React, { useState, useEffect } from 'react';
import { BadgeService } from '../services/api';
import { Copy, RefreshCw, Check, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

const Badges = () => {
  const [label, setLabel] = useState('zenv');
  const [value, setValue] = useState('v1.0.0');
  const [color, setColor] = useState('blue');
  const [logo, setLogo] = useState('python');
  const [previewUrl, setPreviewUrl] = useState('');
  const [generatedUrl, setGeneratedUrl] = useState('');

  const colors = ['blue', 'green', 'red', 'orange', 'yellow', 'purple', 'gray'];
  const logos = ['python', 'github', 'docker', 'react', 'none'];

  useEffect(() => {
    updatePreview();
  }, [label, value, color, logo]);

  const updatePreview = () => {
    // Construction de l'URL pour la preview
    // Utilisation de l'API réelle pour la génération
    let url = `https://zenv-hub.onrender.com/badge/custom/${label}/${value}/${color}`;
    if (logo && logo !== 'none') {
        url += `/${logo}`;
    }
    setPreviewUrl(url);
    setGeneratedUrl(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Badge Workshop</h1>
        <p className="text-slate-400">Create custom SVG badges for your READMEs.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        {/* Controls */}
        <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Label</label>
              <input 
                type="text" 
                value={label} 
                onChange={(e) => setLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Value</label>
              <input 
                type="text" 
                value={value} 
                onChange={(e) => setValue(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
              <div className="flex flex-wrap gap-2">
                {colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                    style={{ backgroundColor: c === 'blue' ? '#007ec6' : c === 'green' ? '#4c1' : c }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Logo</label>
              <select 
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-900 border border-slate-600 rounded-md px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {logos.map(l => (
                    <option key={l} value={l}>{l.charAt(0).toUpperCase() + l.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Preview & Code */}
        <div className="space-y-8">
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 flex flex-col items-center justify-center min-h-[200px]">
            <h3 className="text-slate-400 text-sm uppercase tracking-wider mb-6">Preview</h3>
            <img src={previewUrl} alt="Badge Preview" className="h-8 shadow-lg" onError={(e) => e.target.style.display = 'none'} />
          </div>

          <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
            <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
              <span className="text-sm font-medium text-slate-300">Markdown</span>
              <button 
                onClick={() => copyToClipboard(`![${label}](${generatedUrl})`)}
                className="text-slate-400 hover:text-white"
              >
                <Copy size={16} />
              </button>
            </div>
            <div className="p-4 font-mono text-sm text-blue-300 break-all">
              ![{label}]({generatedUrl})
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Badges;