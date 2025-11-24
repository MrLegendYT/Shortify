import { ShortLink } from '../types';

const STORAGE_KEY = 'shortify_links_v2';

export const getLinks = (): ShortLink[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load links", error);
    return [];
  }
};

export const saveLink = (link: ShortLink): void => {
  const links = getLinks();
  // We no longer check for local alias collision since the API handles it
  const newLinks = [link, ...links];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newLinks));
};

export const deleteLink = (id: string): ShortLink[] => {
  const links = getLinks().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  return links;
};

// Clicks are now tracked by the external service (if authenticated), 
// but for the free API we can't track them locally anymore.
// We keep this function to avoid breaking legacy calls, but it does nothing.
export const incrementClicks = (alias: string): void => {
  // No-op for external links
};

export const getLinkByAlias = (alias: string): ShortLink | undefined => {
  const links = getLinks();
  return links.find(l => l.alias === alias);
};