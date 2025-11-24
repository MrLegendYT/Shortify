import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ShortLink } from './types';
import { getLinks } from './services/storageService';
import ShortenForm from './components/ShortenForm';
import LinkList from './components/LinkList';
import { Github, Twitter } from 'lucide-react';

const HomePage: React.FC = () => {
  const [links, setLinks] = useState<ShortLink[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLinks(getLinks());
  }, []);

  const handleLinkCreated = (newLink: ShortLink) => {
    setLinks(prev => [newLink, ...prev]);
    setError(null);
  };

  const handleError = (msg: string) => {
    setError(msg);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-200 selection:bg-indigo-500/30">
      
      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-8 sm:py-12">
        
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Shorten URLs with <span className="text-indigo-500">AI Precision</span>
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Transform long, ugly links into smart, concise aliases. 
            Powered by <span className="font-semibold text-slate-200">Gemini 2.5 Flash</span> and <span className="font-semibold text-slate-200">TinyURL</span> to generate working short links automatically.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-7 space-y-6">
             {error && (
              <div className="bg-red-900/20 text-red-400 px-4 py-3 rounded-lg text-sm border border-red-900/50 flex items-center">
                <span className="font-bold mr-2">Error:</span> {error}
              </div>
            )}
            
            <ShortenForm onLinkCreated={handleLinkCreated} onError={handleError} />
            
            <div className="bg-slate-900 border border-indigo-500/20 rounded-2xl p-6 text-white relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500 rounded-full blur-3xl opacity-20"></div>
                <h3 className="text-lg font-bold mb-2 relative z-10 text-indigo-100">Pro Tip</h3>
                <p className="text-indigo-200/80 text-sm relative z-10">
                  Use the <strong>AI Magic</strong> button to let Gemini analyze your URL content and create a context-aware alias (e.g., 'summer-sale' instead of 'x7z9a').
                </p>
            </div>
          </div>

          {/* Right Column: List */}
          <div className="lg:col-span-5">
            <LinkList links={links} setLinks={setLinks} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-8 mt-auto">
        <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Shortify. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="text-slate-500 hover:text-slate-300 transition-colors">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </HashRouter>
  );
};

export default App;