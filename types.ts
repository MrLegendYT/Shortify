export interface ShortLink {
  id: string;
  originalUrl: string;
  alias: string;
  shortUrl: string;
  createdAt: number;
  clicks: number;
  aiGenerated: boolean;
}

export interface AliasResponse {
  alias: string;
  reason?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}