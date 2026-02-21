import { useState, useEffect } from 'react';
import { useWallpapers } from './useQueries';

const WALLPAPER_KEY = 'study-sanctuary-wallpaper';

export interface Wallpaper {
  id: string;
  name: string;
  category: string;
  url: string;
  type?: 'image' | 'video';
}

export const wallpapers: Wallpaper[] = [
  {
    id: 'anime-study-1',
    name: 'Anime Study Room',
    category: 'anime',
    url: '/assets/generated/anime-study-1.dim_1920x1080.png',
    type: 'image',
  },
  {
    id: 'anime-library-1',
    name: 'Anime Library',
    category: 'anime',
    url: '/assets/generated/anime-library-1.dim_1920x1080.png',
    type: 'image',
  },
  {
    id: 'library-anime-1',
    name: 'Library Anime 1',
    category: 'study',
    url: '/assets/generated/library-anime-1.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'library-anime-2',
    name: 'Library Anime 2',
    category: 'study',
    url: '/assets/generated/library-anime-2.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'study-nook-anime',
    name: 'Study Nook',
    category: 'study',
    url: '/assets/generated/study-nook-anime.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'library-vintage-anime',
    name: 'Vintage Library',
    category: 'study',
    url: '/assets/generated/library-vintage-anime.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'clouds-anime-1',
    name: 'Peaceful Clouds 1',
    category: 'nature',
    url: '/assets/generated/clouds-anime-1.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'clouds-anime-2',
    name: 'Peaceful Clouds 2',
    category: 'nature',
    url: '/assets/generated/clouds-anime-2.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'clouds-bright-anime',
    name: 'Bright Clouds',
    category: 'nature',
    url: '/assets/generated/clouds-bright-anime.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'ghibli-landscape-1',
    name: 'Ghibli Landscape',
    category: 'ghibli',
    url: '/assets/generated/ghibli-landscape-1.dim_1920x1080.png',
    type: 'image',
  },
  {
    id: 'ghibli-cafe-1',
    name: 'Ghibli Cafe',
    category: 'ghibli',
    url: '/assets/generated/ghibli-cafe-1.dim_1920x1080.png',
    type: 'image',
  },
  {
    id: 'ghibli-countryside',
    name: 'Ghibli Countryside',
    category: 'ghibli',
    url: '/assets/generated/ghibli-countryside.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'ghibli-forest',
    name: 'Ghibli Forest',
    category: 'ghibli',
    url: '/assets/generated/ghibli-forest.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'ghibli-seaside',
    name: 'Ghibli Seaside',
    category: 'ghibli',
    url: '/assets/generated/ghibli-seaside.dim_1920x1080.jpg',
    type: 'image',
  },
  {
    id: 'study-room-1',
    name: 'Cozy Study Room',
    category: 'study',
    url: '/assets/generated/study-room-1.dim_1920x1080.png',
    type: 'image',
  },
  {
    id: 'study-desk-1',
    name: 'Study Desk',
    category: 'study',
    url: '/assets/generated/study-desk-1.dim_1920x1080.png',
    type: 'image',
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
  const allWallpapers: Wallpaper[] = [
    ...wallpapers,
    ...customWallpapers.map(([name, blob]) => ({
      id: `custom-${name}`,
      name,
      category: 'custom',
      url: blob.getDirectURL(),
      type: 'image' as const,
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
