import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { TimerSession, TimerPreset, Goal, GoalType, ExternalBlob } from '../backend';

export function useGetAllSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<TimerSession[]>({
    queryKey: ['sessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.exportSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRecordSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      startTime, 
      endTime, 
      labelText, 
      colorTheme, 
      tags 
    }: { 
      startTime: bigint; 
      endTime: bigint;
      labelText?: string;
      colorTheme?: string;
      tags?: string[];
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.recordSession(
        startTime, 
        endTime, 
        labelText || null, 
        colorTheme || null, 
        tags || null
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
      queryClient.invalidateQueries({ queryKey: ['tags'] });
    },
  });
}

export function useGetAllPresets() {
  const { actor, isFetching } = useActor();

  return useQuery<TimerPreset[]>({
    queryKey: ['presets'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPresets();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePreset() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      name, 
      duration, 
      labelText, 
      colorTheme 
    }: { 
      name: string; 
      duration: bigint; 
      labelText: string; 
      colorTheme: string;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.savePreset(name, duration, labelText, colorTheme);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] });
    },
  });
}

export function useGetAllGoals() {
  const { actor, isFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.exportGoals();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSetGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      name, 
      targetType, 
      targetHours 
    }: { 
      name: string; 
      targetType: GoalType; 
      targetHours: number;
    }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.setGoal(name, targetType, targetHours);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useUpdateGoalProgress() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, hours }: { name: string; hours: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.updateGoalProgress(name, hours);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
  });
}

export function useGetAllTags() {
  const { actor, isFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ['tags'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTags();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSessionsByTag() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (tag: string) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getSessionsByTag(tag);
    },
  });
}

export function useExportData() {
  const { actor } = useActor();

  return {
    exportSessions: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.exportSessions();
    },
    exportPresets: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.exportPresets();
    },
    exportGoals: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.exportGoals();
    },
  };
}

// Wallpaper management hooks
export function useWallpapers() {
  const { actor, isFetching } = useActor();

  return useQuery<[string, ExternalBlob][]>({
    queryKey: ['wallpapers'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllWallpapers();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUploadWallpaper() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, blob }: { name: string; blob: ExternalBlob }) => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.uploadWallpaper(name, blob);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallpapers'] });
    },
  });
}
