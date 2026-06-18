/**
 * @file Utility functions for timestamp formatting and conversion
 */

// @ts-ignore: constants from a non ts file
import { ONE_HOUR_MS, DEFAULT_VIDEO_FPS } from '../constants';

/**
 * Converts a timestamp representation to seconds
 * @param timestamp The timestamp in milliseconds
 * @returns The total seconds
 */
const convertTimestampToSeconds = (timestamp: number): number => {
    if (!timestamp || Number.isNaN(Number(timestamp))) {
        return 0;
    }
    const totalSeconds = timestamp / 1000;
    return totalSeconds;
};

/**
 * Converts milliseconds to HH:MM:SS format
 * @param timestampInMilliseconds The timestamp in milliseconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
const convertMillisecondsToHMMSS = (timestampInMilliseconds: number): string => {
    if (!timestampInMilliseconds || timestampInMilliseconds < 0) {
        return '0:00:00';
    }
    const hours = Math.floor(timestampInMilliseconds / ONE_HOUR_MS);
    const minutes = Math.floor((timestampInMilliseconds % ONE_HOUR_MS) / 60000);
    const seconds = Math.floor((timestampInMilliseconds % 60000) / 1000);
    // timestamp in the format 1:23:45
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

/**
 * Converts seconds to HH:MM:SS format
 * @param seconds number of seconds
 * @returns The formatted timestamp string in HH:MM:SS format
 */
const convertSecondsToHMMSS = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secondsValue = seconds % 60;
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${secondsValue.toString().padStart(2, '0')}`;
};

/**
 * Converts milliseconds to a video-style timestamp, omitting the hours field for durations under one hour.
 * @param timestampInMilliseconds The timestamp in milliseconds
 * @returns The formatted timestamp: M:SS when under an hour, H:MM:SS otherwise
 */
const convertMillisecondsToTimestamp = (timestampInMilliseconds: number): string => {
    if (!timestampInMilliseconds || timestampInMilliseconds < 0) {
        return '0:00';
    }
    const hours = Math.floor(timestampInMilliseconds / ONE_HOUR_MS);
    const minutes = Math.floor((timestampInMilliseconds % ONE_HOUR_MS) / 60000);
    const seconds = Math.floor((timestampInMilliseconds % 60000) / 1000);
    const paddedSeconds = seconds.toString().padStart(2, '0');
    if (hours === 0) {
        return `${minutes.toString()}:${paddedSeconds}`;
    }
    return `${hours.toString()}:${minutes.toString().padStart(2, '0')}:${paddedSeconds}`;
};

const convertMillisecondsToTimecode = (timestampInMilliseconds: number, fps: number): string => {
    const seconds = timestampInMilliseconds && timestampInMilliseconds > 0 ? timestampInMilliseconds / 1000 : 0;
    const validSeconds = Number.isFinite(seconds) ? seconds : 0;
    const validFps = Number.isFinite(fps) && fps > 0 ? fps : DEFAULT_VIDEO_FPS;
    const totalFrames = Math.floor(validSeconds * validFps);
    const frameBase = Math.round(validFps);

    const hours = Math.floor(totalFrames / (frameBase * 3600));
    const minutes = Math.floor((totalFrames % (frameBase * 3600)) / (frameBase * 60));
    const secs = Math.floor((totalFrames % (frameBase * 60)) / frameBase);
    const frames = totalFrames % frameBase;

    const hh = hours.toString().padStart(2, '0');
    const mm = minutes.toString().padStart(2, '0');
    const ss = secs.toString().padStart(2, '0');
    const ff = frames.toString().padStart(2, '0');

    return `${hh}:${mm}:${ss}:${ff}`;
};

const convertMillisecondsToFrames = (timestampInMilliseconds: number, fps: number): number => {
    if (!timestampInMilliseconds || timestampInMilliseconds < 0) {
        return 0;
    }
    const validFps = Number.isFinite(fps) && fps > 0 ? fps : DEFAULT_VIDEO_FPS;
    return Math.floor((timestampInMilliseconds / 1000) * validFps);
};

export {
    convertMillisecondsToFrames,
    convertMillisecondsToHMMSS,
    convertMillisecondsToTimecode,
    convertMillisecondsToTimestamp,
    convertSecondsToHMMSS,
    convertTimestampToSeconds,
};
