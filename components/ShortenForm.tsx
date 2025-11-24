import React, { useState } from 'react';
import { Wand2, Link as LinkIcon, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { generateSmartAlias } from '../services/geminiService';
import { shortenWithTinyUrl } from '../services/shortenerService';
import { saveLink } from '../services/storageService';
import { ShortLink } from '../types';

interface ShortenFormProps {
  onLinkCreated: (link: ShortLink) => void;
  onError: (msg: string) => void;
}

const ShortenForm: React.FC<ShortenFormProps> = ({ onLinkCreated, onError }) => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [aiGeneratedAlias, setAiGeneratedAlias] = useState(false);

  const handleAiGenerate = async () => {
    if (!url) {
      onError("Please enter a URL first.");
      return;
    }
    
    try {
      setIsGenerating(true);
      const suggestedAlias = await generateSmartAlias(url);
      setAlias(suggestedAlias);
      setAiGeneratedAlias(true);
    } catch (error) {
      onError("Failed to generate AI alias. Try manual entry.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAliasChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAlias(e.target.value.replace(/[^a-zA-Z0-9-]/g, ''));
    setAiGeneratedAlias(false); // User modified it, so no longer purely AI
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    // Ensure URL has protocol
    let finalUrl = url.trim();
    if (!/^https?:\/\//i.test(finalUrl)) {
      finalUrl = 'https://' + finalUrl;
    }

    // Basic URL validation
    try {
      new URL(finalUrl);
    } catch (_) {
      onError("Please enter a valid URL.");
      return;
    }

    try {
      setIsSubmitting(true);
      
      let result;
      try {
        // Attempt 1: Try with the provided alias (if any)
        result = await shortenWithTinyUrl(finalUrl, alias);
      } catch (err: any) {
        // If it failed because the alias is taken...
        if (alias && (aiGeneratedAlias || err.message.includes('taken'))) {
          if (aiGeneratedAlias) {
            // If it was AI generated, fail gracefully by retrying without an alias (random)
            console.log("AI Alias taken, retrying with random...");
            result = await shortenWithTinyUrl(finalUrl, undefined);
            onError(`Note: The AI alias '${alias}' was taken, so we assigned a random one.`);
          } else {
            // If user typed it manually, show the error
            throw err;
          }
        } else {
          throw err;
        }
      }

      const newLink: ShortLink = {
        id: crypto.randomUUID(),
        originalUrl: finalUrl,
        alias: result.alias,
        shortUrl: result.shortUrl,
        createdAt: Date.now(),
        clicks: 0, 
        aiGenerated: aiGeneratedAlias
      };

      saveLink(newLink);
      onLinkCreated(newLink);
      setUrl('');
      setAlias('');
      setAiGeneratedAlias(false);
    } catch (e: any) {
      onError(e.message || "Failed to shorten link.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 border border-slate-800 relative overflow-hidden z-10">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 z-0"></div>
      
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
        <LinkIcon className="w-6 h-6 text-indigo-400" />
        Shorten a new link
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5 relative z-20">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-slate-300 mb-1.5">Destination URL</label>
          <div className="relative">
            <input
              type="text"
              id="url"
              placeholder="example.com/very-long-url"
              className="w-full pl-4 pr-4 py-3.5 bg-slate-950 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-600 relative z-20"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="alias" className="block text-sm font-medium text-slate-300 mb-1.5">
            Custom Alias <span className="text-slate-500 font-normal">(Optional)</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-medium select-none z-30 pointer-events-none">
                tinyurl.com/
              </span>
              <input
                type="text"
                id="alias"
                placeholder="custom-alias"
                className="w-full pl-28 pr-4 py-3.5 bg-slate-950 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none placeholder:text-slate-600 relative z-20"
                value={alias}
                onChange={handleAliasChange}
                maxLength={30}
              />
            </div>
            
            <button
              type="button"
              onClick={handleAiGenerate}
              disabled={isGenerating || !url}
              className="px-4 py-3.5 bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 rounded-xl hover:bg-indigo-500/20 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 focus:ring-offset-slate-900 transition-all flex items-center justify-center gap-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap z-20"
              title="Generate catchy alias with Gemini AI"
            >
              {isGenerating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4" />
              )}
              <span className="inline">AI Magic</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Leave empty for a random short link, or use AI Magic to generate a contextual alias.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-4 rounded-xl shadow-lg shadow-indigo-900/20 hover:shadow-indigo-500/30 transition-all flex items-center justify-center gap-2 group mt-2 relative z-20"
        >
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Shorten URL
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ShortenForm;