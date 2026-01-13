import React from 'react';
import { AlertCircle, CheckCircle, Info } from 'lucide-react';

interface StatusAlertProps {
  isValid: boolean;
  error?: string;
  canonicalFound?: string;
}

export const StatusAlert: React.FC<StatusAlertProps> = ({ isValid, error, canonicalFound }) => {
  if (error) {
    return (
      <div className="flex items-start p-4 text-sm text-amber-200 bg-amber-900/30 border border-amber-700/50 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
        <AlertCircle className="w-5 h-5 mr-3 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-amber-400 mb-1">Attention Needed</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (canonicalFound) {
    return (
      <div className="flex items-start p-4 text-sm text-emerald-200 bg-emerald-900/30 border border-emerald-700/50 rounded-lg animate-in fade-in slide-in-from-bottom-2 duration-300">
        <CheckCircle className="w-5 h-5 mr-3 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="font-semibold text-emerald-400 mb-1">Success</h4>
          <p>Found canonical URL: <span className="font-mono text-emerald-100 opacity-80">{canonicalFound}</span></p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center p-4 text-sm text-slate-300 bg-slate-800/50 border border-slate-700 rounded-lg">
      <Info className="w-5 h-5 mr-3 text-slate-400 flex-shrink-0" />
      <p>Paste your MDX content with YAML frontmatter to begin.</p>
    </div>
  );
};
