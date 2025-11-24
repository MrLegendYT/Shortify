import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLinkByAlias, incrementClicks } from '../services/storageService';
import { Loader2, AlertCircle, ArrowLeft } from 'lucide-react';

const RedirectHandler: React.FC = () => {
  const { alias } = useParams<{ alias: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!alias) {
      setError("No alias provided.");
      return;
    }

    const link = getLinkByAlias(alias);

    if (link) {
      // Valid link found
      incrementClicks(alias);
      
      // Artificial delay just to show the nice loading state briefly, 
      // in a real app this would be instant or wait for server latency.
      const timer = setTimeout(() => {
        window.location.href = link.originalUrl;
      }, 800);

      return () => clearTimeout(timer);
    } else {
      setError(`Link /${alias} not found.`);
    }
  }, [alias]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-slate-900 p-8 rounded-2xl shadow-xl max-w-md w-full text-center border border-slate-800">
          <div className="w-16 h-16 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-slate-400 mb-8">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20"
          >
            <ArrowLeft className="w-5 h-5" />
            Go to Shortify Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
      <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
      <h2 className="text-xl font-medium text-slate-200">Redirecting you...</h2>
      <p className="text-slate-500 text-sm mt-2">Hang tight, we're taking you to your destination.</p>
    </div>
  );
};

export default RedirectHandler;