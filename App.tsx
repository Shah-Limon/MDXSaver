import React, { useState, useEffect } from 'react';
import { Download, FileText } from 'lucide-react';
import { Header } from './components/Header';
import { Button } from './components/Button';
import { StatusAlert } from './components/StatusAlert';
import { analyzeContent } from './utils/parser';

const DEFAULT_PLACEHOLDER = `---
title: "The Best Stain Resistant Couches"
date: "2023-10-27"
metadata:
  canonical: https://www.example.com/best-stain-resistant-couch
  author: "Jane Doe"
---

# Your MDX Content Here

Paste your article content here. The filename will be automatically generated from the canonical URL above.
`;

const App: React.FC = () => {
  const [content, setContent] = useState<string>('');
  const [filename, setFilename] = useState<string>('untitled.mdx');
  const [parseStatus, setParseStatus] = useState<{
    isValid: boolean;
    error?: string;
    canonicalFound?: string;
  }>({ isValid: false });

  // Analyze content whenever it changes
  useEffect(() => {
    if (!content.trim()) {
      setParseStatus({ isValid: false });
      setFilename('untitled.mdx');
      return;
    }

    const result = analyzeContent(content);
    setFilename(result.filename);
    setParseStatus({
      isValid: result.isValid,
      error: result.error,
      canonicalFound: result.canonicalFound,
    });
  }, [content]);

  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/mdx;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup URL object
    setTimeout(() => URL.revokeObjectURL(url), 100);

    // Clear the editor and reset state for the next file
    setContent('');
    setFilename('untitled.mdx');
    setParseStatus({ isValid: false });
  };

  const handleLoadSample = () => {
    setContent(DEFAULT_PLACEHOLDER);
  };
  
  const isDownloadDisabled = !content || filename === 'untitled.mdx';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Area */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="relative flex-grow flex flex-col min-h-[500px] h-[calc(100vh-250px)] rounded-xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden group focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all">
              <div className="absolute top-0 left-0 right-0 h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between select-none z-10">
                <div className="flex items-center gap-4 flex-1 min-w-0 mr-4">
                  <span className="text-xs font-mono text-slate-500 flex items-center flex-shrink-0">
                    <span className="w-2 h-2 rounded-full bg-red-500/20 mr-2 border border-red-500/50"></span>
                    Editor
                  </span>
                  
                  {/* Filename Input in Top Bar */}
                  <div className="relative group flex items-center max-w-xs w-full hidden sm:flex">
                    <FileText className="w-3.5 h-3.5 text-slate-600 absolute left-2 pointer-events-none group-focus-within:text-indigo-400 transition-colors" />
                    <input 
                      type="text" 
                      value={filename}
                      onChange={(e) => setFilename(e.target.value)}
                      className="w-full bg-slate-950/50 border border-slate-800 hover:border-slate-700 focus:border-indigo-500/50 rounded py-1 pl-7 pr-2 text-xs font-mono text-slate-300 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all truncate"
                      placeholder="filename.mdx"
                      spellCheck={false}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0">
                   <button 
                    onClick={handleDownload} 
                    disabled={isDownloadDisabled}
                    className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/20 hover:border-emerald-500/40 rounded text-xs font-medium transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                    title={isDownloadDisabled ? "Enter a valid filename to download" : "Download .mdx"}
                   >
                     <Download className="w-3.5 h-3.5" />
                     <span>Download</span>
                   </button>
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your MDX content here..."
                className="flex-grow w-full bg-transparent p-4 mt-10 text-sm sm:text-base font-mono leading-relaxed text-slate-300 resize-none focus:outline-none placeholder-slate-700"
                spellCheck={false}
              />
            </div>
            
            {!content && (
              <div className="text-center">
                <button 
                  onClick={handleLoadSample}
                  className="text-sm text-indigo-400 hover:text-indigo-300 hover:underline transition-all"
                >
                  Load sample content
                </button>
              </div>
            )}
          </div>

          {/* Sidebar Controls */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Filename Card */}
            <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-lg">
              <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                Output Filename
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  value={filename}
                  onChange={(e) => setFilename(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm font-mono text-slate-200 transition-all"
                />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                Auto-generated from <code className="bg-slate-800 px-1 py-0.5 rounded text-slate-400">metadata.canonical</code>
              </p>
            </div>

            {/* Status Card */}
            <StatusAlert 
              isValid={parseStatus.isValid} 
              error={parseStatus.error} 
              canonicalFound={parseStatus.canonicalFound} 
            />

            {/* Action Area */}
            <div className="pt-4">
              <Button 
                onClick={handleDownload}
                disabled={isDownloadDisabled}
                variant="success"
                className="w-full h-12 text-base shadow-emerald-500/20"
                icon={<Download className="w-5 h-5" />}
              >
                Download .mdx
              </Button>
              
              <p className="text-center text-xs text-slate-600 mt-4">
                File is saved locally to your device.
              </p>
            </div>

            {/* Quick Tips */}
            <div className="mt-8 pt-8 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-400 mb-3">How it works</h3>
              <ul className="space-y-2 text-xs text-slate-500 leading-relaxed">
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-500">•</span>
                  Pasting MDX content automatically parses the Frontmatter.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-500">•</span>
                  Look for <code>metadata: canonical: ...</code> to extract the slug.
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-indigo-500">•</span>
                  The filename is editable if the auto-detection fails or needs adjustment.
                </li>
              </ul>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default App;