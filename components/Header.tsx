import React from 'react';
import { FileCode, Save } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="flex items-center justify-between py-6 mb-8 border-b border-slate-800">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
          <FileCode className="w-6 h-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">MDX Canonical Saver</h1>
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Frontmatter Utility</p>
        </div>
      </div>
      <a 
        href="#" 
        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center"
        onClick={(e) => e.preventDefault()}
      >
        <Save className="w-3 h-3 mr-1.5" />
        v1.0.0
      </a>
    </header>
  );
};
