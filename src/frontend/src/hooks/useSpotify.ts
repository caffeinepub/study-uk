import { useState, useEffect, useCallback } from 'react';

const CLIENT_ID = 'YOUR_SPOTIFY_CLIENT_ID';
const REDIRECT_URI = window.location.origin + '/';
const SCOPES = [
  'streaming',
  'user-read-email',
  'user-read-private',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
];

const TOKEN_KEY = 'spotify_access_token';
const EXPIRY_KEY = 'spotify_token_expiry';

export function useSpotify() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    const expiry = localStorage.getItem(EXPIRY_KEY);

    if (token && expiry && Date.now() < parseInt(expiry)) {
      setAccessToken(token);
      setIsConnected(true);
    }

    const hash = window.location.hash;
    if (hash) {
      const params = new URLSearchParams(hash.substring(1));
      const token = params.get('access_token');
      const expiresIn = params.get('expires_in');

      if (token && expiresIn) {
        const expiry = Date.now() + parseInt(expiresIn) * 1000;
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(EXPIRY_KEY, expiry.toString());
        setAccessToken(token);
        setIsConnected(true);
        window.history.replaceState({}, document.title, '/');
      }
    }
  }, []);

  useEffect(() => {
    if (!accessToken) return;

    const fetchCurrentTrack = async () => {
      try {
        const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok && response.status !== 204) {
          const data = await response.json();
          setCurrentTrack(data.item);
          setIsPlaying(data.is_playing);
        }
      } catch (error) {
        console.error('Error fetching current track:', error);
      }
    };

    fetchCurrentTrack();
    const interval = setInterval(fetchCurrentTrack, 5000);

    return () => clearInterval(interval);
  }, [accessToken]);

  const login = useCallback(() => {
    const authUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(
      REDIRECT_URI
    )}&scope=${encodeURIComponent(SCOPES.join(' '))}`;
    window.location.href = authUrl;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(EXPIRY_KEY);
    setAccessToken(null);
    setIsConnected(false);
    setCurrentTrack(null);
    setIsPlaying(false);
  }, []);

  const play = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch('https://api.spotify.com/v1/me/player/play', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error playing:', error);
    }
  }, [accessToken]);

  const pause = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch('https://api.spotify.com/v1/me/player/pause', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      setIsPlaying(false);
    } catch (error) {
      console.error('Error pausing:', error);
    }
  }, [accessToken]);

  const next = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch('https://api.spotify.com/v1/me/player/next', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error skipping to next:', error);
    }
  }, [accessToken]);

  const previous = useCallback(async () => {
    if (!accessToken) return;
    try {
      await fetch('https://api.spotify.com/v1/me/player/previous', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Error going to previous:', error);
    }
  }, [accessToken]);

  return {
    isConnected,
    currentTrack,
    isPlaying,
    login,
    logout,
    play,
    pause,
    next,
    previous,
  };
}
