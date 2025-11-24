export const shortenWithTinyUrl = async (url: string, alias?: string): Promise<{ shortUrl: string; alias: string }> => {
  const baseUrl = 'https://tinyurl.com/api-create.php';
  const params = new URLSearchParams({ url });
  
  if (alias && alias.trim().length > 0) {
    params.append('alias', alias.trim());
  }

  try {
    // Note: TinyURL API endpoint behavior with CORS:
    // If successful, it returns the URL text.
    // If alias is taken, it returns "Error".
    const response = await fetch(`${baseUrl}?${params.toString()}`);
    const text = await response.text();

    if (!response.ok || text.trim() === 'Error') {
      if (alias) {
        throw new Error(`The alias "${alias}" is already taken. Please choose another.`);
      }
      throw new Error('Invalid URL. Please ensure it starts with http:// or https://');
    }

    // TinyURL returns the full URL (e.g., https://tinyurl.com/my-alias)
    const shortUrl = text;
    // Extract alias from the result or use the requested one
    const derivedAlias = shortUrl.split('.com/')[1] || alias || 'unknown';

    return { shortUrl, alias: derivedAlias };
  } catch (error: any) {
    console.error("Shortener API Error:", error);
    // If it's a fetch error (network/CORS) vs a logic error
    if (error.message === 'Failed to fetch') {
      throw new Error("Network error. Please check your connection.");
    }
    throw error;
  }
};