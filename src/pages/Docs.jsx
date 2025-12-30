import React from 'react';

const Docs = () => (
    <div className="max-w-3xl mx-auto px-4 py-12 prose prose-invert">
        <h1>Documentation</h1>
        <p>Zenv is a dual-layer package manager.</p>
        
        <h2>Installation</h2>
        <pre>pip install zenv-lang</pre>
        <p>Then install the core logic:</p>
        <pre>zenv install zenv[core]</pre>
        
        <h2>Usage</h2>
        <p>Once core is installed, use <code>znv</code>:</p>
        <ul>
            <li><code>znv search &lt;query&gt;</code>: Search packages</li>
            <li><code>znv install &lt;pkg&gt;</code>: Install package</li>
            <li><code>znv auth &lt;token&gt;</code>: Authenticate CLI</li>
        </ul>
    </div>
);
export default Docs;