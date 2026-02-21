import { useState, useEffect } from 'react';
import { useWallpapers } from './useQueries';

const WALLPAPER_KEY = 'study-sanctuary-wallpaper';

export const wallpapers = [
  {
    id: 'anime-study-1',
    name: 'Anime Study Room',
    category: 'anime',
    url: '/assets/generated/anime-study-1.dim_1920x1080.png',
  },
  {
    id: 'anime-library-1',
    name: 'Anime Library',
    category: 'anime',
    url: '/assets/generated/anime-library-1.dim_1920x1080.png',
  },
  {
    id: 'ghibli-landscape-1',
    name: 'Ghibli Landscape',
    category: 'ghibli',
    url: '/assets/generated/ghibli-landscape-1.dim_1920x1080.png',
  },
  {
    id: 'ghibli-cafe-1',
    name: 'Ghibli Cafe',
    category: 'ghibli',
    url: '/assets/generated/ghibli-cafe-1.dim_1920x1080.png',
  },
  {
    id: 'study-room-1',
    name: 'Cozy Study Room',
    category: 'study',
    url: '/assets/generated/study-room-1.dim_1920x1080.png',
  },
  {
    id: 'study-desk-1',
    name: 'Study Desk',
    category: 'study',
    url: '/assets/generated/study-desk-1.dim_1920x1080.png',
  },
];

export function useWallpaper() {
  const [selectedWallpaper, setSelectedWallpaper] = useState(() => {
    const saved = localStorage.getItem(WALLPAPER_KEY);
    return saved || wallpapers[0].id;
  });

  const { data: customWallpapers = [] } = useWallpapers();

  useEffect(() => {
    localStorage.setItem(WALLPAPER_KEY, selectedWallpaper);
  }, [selectedWallpaper]);

  // Merge predefined and custom wallpapers
  const allWallpapers = [
    ...wallpapers,
    ...customWallpapers.map(([name, blob]) => ({
      id: `custom-${name}`,
      name,
      category: 'custom',
      url: blob.getDirectURL(),
    })),
  ];

  const currentWallpaper = allWallpapers.find((w) => w.id === selectedWallpaper) || wallpapers[0];

  return {
    selectedWallpaper,
    setSelectedWallpaper,
    currentWallpaper,
    wallpapers: allWallpapers,
  };
}
