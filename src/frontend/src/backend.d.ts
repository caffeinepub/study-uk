import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface TimerSession {
    startTime: Time;
    duration: bigint;
    endTime: Time;
    colorTheme: string;
    tags: Array<string>;
    labelText: string;
}
export interface TimerPreset {
    duration: bigint;
    colorTheme: string;
    labelText: string;
}
export interface Goal {
    achieved: boolean;
    streak: bigint;
    progress: number;
    targetType: GoalType;
    targetHours: number;
}
export enum GoalType {
    Daily = "Daily"
}
export interface backendInterface {
    exportGoals(): Promise<Array<Goal>>;
    exportPresets(): Promise<Array<TimerPreset>>;
    exportSessions(): Promise<Array<TimerSession>>;
    getAllPresets(): Promise<Array<TimerPreset>>;
    getAllTags(): Promise<Array<string>>;
    getAllWallpapers(): Promise<Array<[string, ExternalBlob]>>;
    getAverageSessionDuration(): Promise<number>;
    getSessionCount(): Promise<bigint>;
    getSessionsByLabel(labelText: string): Promise<Array<TimerSession>>;
    getSessionsByTag(tag: string): Promise<Array<TimerSession>>;
    getWallpaper(name: string): Promise<ExternalBlob | null>;
    listWallpapers(): Promise<Array<string>>;
    recordSession(startTime: Time, endTime: Time, labelText: string | null, colorTheme: string | null, tags: Array<string> | null): Promise<void>;
    savePreset(name: string, duration: bigint, labelText: string, colorTheme: string): Promise<void>;
    setGoal(name: string, targetType: GoalType, targetHours: number): Promise<void>;
    updateGoalProgress(name: string, hours: number): Promise<void>;
    uploadWallpaper(name: string, blob: ExternalBlob): Promise<void>;
}
