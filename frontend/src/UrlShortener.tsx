import React, { useState } from 'react';
import { Copy, Link, Loader2, AlertCircle } from 'lucide-react';

// TypeScript interfaces for type safety
interface ShortenResponse {
  shortUrl: string;
}

interface ApiError {
  message: string;
}

const UrlShortener: React.FC = () => {
  // State management using React hooks
  const [longUrl, setLongUrl] = useState<string>('');
  const [shortUrl, setShortUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Validate URL format
  const isValidUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Handle URL shortening API call
  const handleShorten = async (): Promise<void> => {
    // Reset previous states
    setError('');
    setShortUrl('');
    setCopied(false);

    // Validate input
    if (!longUrl.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!isValidUrl(longUrl)) {
      setError('Please enter a valid URL (include http:// or https://)');
      return;
    }

    setLoading(true);

    try {
      // Make API call to backend
      const response = await fetch('http://localhost:8080/shortURL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ urls: longUrl }).toString(),
      });

      // Check if response is HTML (common when API endpoint doesn't exist)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('text/html')) {
        throw new Error('API endpoint not found. Please ensure your backend server is running and the /shortURL endpoint is configured.');
      }

      if (!response.ok) {
        // Try to parse JSON error, but handle cases where it's not JSON
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch (parseError) {
          throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }
      }

      const data = await response.json();
      setShortUrl(`http://localhost:8080/${data.shortURL}`);
    } catch (err) {
      if (err instanceof Error) {
        // Handle specific error cases
        if (err.message.includes('fetch')) {
          setError('Cannot connect to server. Please check if your backend is running.');
        } else if (err.message.includes('JSON')) {
          setError('API endpoint returned invalid response. Please check your backend configuration.');
        } else {
          setError(err.message);
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle copy to clipboard
  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError('Failed to copy to clipboard');
    }
  };

  // Handle Enter key press in input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleShorten();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Link className="w-12 h-12 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">QuickLink</h1>
          <p className="text-gray-600">Make your long URLs short and shareable</p>
        </div>

        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label htmlFor="url-input" className="block text-sm font-medium text-gray-700 mb-2">
              Enter your long URL
            </label>
            <input
              id="url-input"
              type="url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com/very-long-url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
              disabled={loading}
            />
          </div>

          {/* Shorten Button */}
          <button
            onClick={handleShorten}
            disabled={loading || !longUrl.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Shortening...</span>
              </>
            ) : (
              <span>Shorten URL</span>
            )}
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Success Display */}
        {shortUrl && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm font-medium text-green-800">URL shortened successfully!</p>
            </div>
            
            <div className="bg-white border border-green-200 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Your short URL:</p>
              <div className="flex items-center space-x-2">
                <code className="flex-1 text-blue-600 font-mono text-sm bg-gray-50 px-2 py-1 rounded">
                  {shortUrl}
                </code>
                <button
                  onClick={handleCopy}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors duration-200 flex items-center space-x-1"
                  title="Copy to clipboard"
                >
                  <Copy className="w-4 h-4" />
                  <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-sm text-gray-500 pt-4 border-t">
          Enter a URL above to create a shortened link
        </div>
      </div>
    </div>
  );
};

export default UrlShortener;