import type { TimerSession, TimerPreset, Goal } from '../backend';

export function convertSessionsToCSV(sessions: TimerSession[]): string {
  const headers = ['Start Time', 'End Time', 'Duration (hours)', 'Label', 'Color', 'Tags'];
  const rows = sessions.map((session) => [
    new Date(Number(session.startTime) / 1_000_000).toISOString(),
    new Date(Number(session.endTime) / 1_000_000).toISOString(),
    (Number(session.duration) / 1_000_000_000 / 3600).toFixed(2),
    escapeCSV(session.labelText),
    escapeCSV(session.colorTheme),
    escapeCSV(session.tags.join('; ')),
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

export function convertPresetsToCSV(presets: TimerPreset[]): string {
  const headers = ['Label', 'Duration (minutes)', 'Color'];
  const rows = presets.map((preset) => [
    escapeCSV(preset.labelText),
    (Number(preset.duration) / 1_000_000_000 / 60).toFixed(0),
    escapeCSV(preset.colorTheme),
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

export function convertGoalsToCSV(goals: Goal[]): string {
  const headers = ['Target Type', 'Target Hours', 'Progress', 'Achieved', 'Streak'];
  const rows = goals.map((goal) => [
    goal.targetType,
    goal.targetHours.toString(),
    goal.progress.toFixed(2),
    goal.achieved.toString(),
    goal.streak.toString(),
  ]);
  return [headers, ...rows].map((row) => row.join(',')).join('\n');
}

function escapeCSV(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function downloadFile(content: string, filename: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function convertToJSON<T>(data: T): string {
  return JSON.stringify(data, null, 2);
}
