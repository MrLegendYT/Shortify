import React, { useState } from 'react';
import { ShortLink } from '../types';
import { ExternalLink, Copy, Trash2, Check, BarChart3, Globe } from 'lucide-react';
import { deleteLink } from '../services/storageService';

interface LinkListProps {
  links: ShortLink[];
  setLinks: React.Dispatch<React.SetStateAction<ShortLink[]>>;
}

const LinkList: React.FC<LinkListProps> = ({ links, setLinks }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this link?')) {
      const updated = deleteLink(id);
      setLinks(updated);
    }
  };

  const handleCopy = (shortUrl: string, id: string) => {
    navigator.clipboard.writeText(shortUrl).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-12 px-4 rounded-2xl bg-slate-900/50 border border-slate-800 border-dashed">
        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Globe className="w-8 h-8 text-indigo-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-200 mb-1">No links created yet</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Paste a long URL above and let our AI create a magic shortcut for you.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-indigo-400" />
        Your Short Links
      </h3>
      <div className="grid gap-4">
        {links.map((link) => {
          return (
            <div key={link.id} className="bg-slate-900 rounded-xl p-5 border border-slate-800 shadow-sm hover:shadow-md hover:border-slate-700 transition-all group">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <a 
                      href={link.shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-indigo-400 hover:text-indigo-300 truncate block transition-colors"
                    >
                      {link.shortUrl}
                    </a>
                    {link.aiGenerated && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold tracking-wider text-purple-300 bg-purple-900/30 rounded uppercase border border-purple-500/20">
                        AI
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-sm truncate flex items-center gap-1 group-hover:text-slate-400 transition-colors">
                    <ExternalLink className="w-3 h-3" />
                    {link.originalUrl}
                  </p>
                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                    <span>{new Date(link.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                   <button
                    onClick={() => handleCopy(link.shortUrl, link.id)}
                    className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Copy Short Link"
                  >
                    {copiedId === link.id ? (
                      <Check className="w-5 h-5 text-green-400" />
                    ) : (
                      <Copy className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => handleDelete(link.id)}
                    className="p-2 text-slate-500 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete Link"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LinkList;