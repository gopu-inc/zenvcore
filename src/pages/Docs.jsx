import React from 'react';
import { Book, Terminal, Settings, Package } from 'lucide-react';

const DocSection = ({ title, children, icon: Icon }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-6 border-b border-slate-700 pb-2">
      {Icon && <Icon className="text-blue-500" size={24} />}
      <h2 className="text-2xl font-bold text-white">{title}</h2>
    </div>
    <div className="space-y-4 text-slate-300 leading-relaxed">
      {children}
    </div>
  </div>
);

const CodeBlock = ({ code, language = 'bash' }) => (
  <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm border border-slate-800 my-4 overflow-x-auto">
    <div className="flex gap-2 mb-2">
      <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
      <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
      <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
    </div>
    <pre className="text-blue-300">
      <code>{code}</code>
    </pre>
  </div>
);

const Docs = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-white mb-4">Documentation</h1>
        <p className="text-xl text-slate-400">Everything you need to know about Zenv.</p>
      </div>

      <DocSection title="Installation" icon={Terminal}>
        <p>Zenv is available via PyPI as <code>zenv-lang</code>. It is a modern package manager written in Python.</p>
        <CodeBlock code="$ pip install zenv-lang" />
        <p>Once the base CLI is installed, you need to install the core package:</p>
        <CodeBlock code="$ zenv install zenv[core]" />
        <p>Verify your installation:</p>
        <CodeBlock code="$ zenv version" />
      </DocSection>

      <DocSection title="Usage" icon={Package}>
        <h3 className="text-lg font-semibold text-white mt-4">Installing Packages</h3>
        <p>Install packages from the Zenv Hub easily:</p>
        <CodeBlock code="$ zenv install <package_name>" />
        
        <h3 className="text-lg font-semibold text-white mt-4">Searching</h3>
        <p>Find packages directly from your terminal:</p>
        <CodeBlock code="$ zenv search <query>" />

        <h3 className="text-lg font-semibold text-white mt-4">Authentication</h3>
        <p>To publish private packages or access restricted resources, authenticate using your token:</p>
        <CodeBlock code="$ zenv auth <your_token>" />
      </DocSection>

      <DocSection title="Creating Packages" icon={Settings}>
        <p>A Zenv package consists of a <code>package.zcf</code> (Zenv Configuration File) manifest and your source code.</p>
        
        <h3 className="text-lg font-semibold text-white mt-4">Structure</h3>
        <CodeBlock code={`my-package/
├── package.zcf      # Manifest
├── src/
│   └── main.py      # Source code
└── README.md`} language="text" />

        <h3 className="text-lg font-semibold text-white mt-4">Example Manifest (package.zcf)</h3>
        <CodeBlock code={`[Zenv]
name = "my-awesome-tool"
version = "1.0.0"
author = "DevName"
description = "A useful tool"
license = "MIT"

[Build]
type = "zenv"
entry_point = "src/main.py"
output = "dist/{name}-{version}.zv"

[entrypoint]
my-tool = "src/main.py"`} language="toml" />

        <h3 className="text-lg font-semibold text-white mt-4">Publishing</h3>
        <p>Once your package is ready, publish it to the hub:</p>
        <CodeBlock code="$ zenv publish" />
      </DocSection>
    </div>
  );
};

export default Docs;