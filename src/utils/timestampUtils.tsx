/**
 * @file Utility functions for timestamp formatting and conversion
 */

import * as React from 'react';
import { IntlShape } from 'react-intl';
import messages from '../elements/content-sidebar/activity-feed/common/activity-message/messages';

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
    // detect if the timestamp is a number

    // convert to HMMSS based on locale
    if (!timestampInMilliseconds || timestampInMilliseconds < 0) {
        return '0:00:00';
    }
    const hours = Math.floor(timestampInMilliseconds / 3600000);
    const minutes = Math.floor((timestampInMilliseconds % 3600000) / 60000);
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
 * Formats text containing a timestamp by wrapping the timestamp in a Link component
 * @param text The text containing the timestamp
 * @param timestamp The timestamp string
 * @param contentKey The key to use for the React Fragment
 * @returns A React Fragment with formatted timestamp
 */
const formatTimestamp = (text: string, timestamp: string, intl: IntlShape): React.ReactElement | string => {
    const textAfterTimestamp = text.replace(timestamp ?? '', '');
    const strippedTimestamp = timestamp.replace(/#\[|\]/g, '');
    if (!strippedTimestamp) {
        return text;
    }

    const timeStampSection = /timestamp:\d+/.exec(timestamp);
    const timeStampValue = timeStampSection?.[0].split(':')[1];
    const timestampInMilliseconds = parseInt(timeStampValue, 10);
    if (Number.isNaN(timestampInMilliseconds)) {
        return textAfterTimestamp;
    }
    // convert milliseconds to HH:MM:SS
    const timestampInHHMMSS = convertMillisecondsToHMMSS(timestampInMilliseconds);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const videoContainer = document.querySelector('.bp-media-dash');
        if (videoContainer) {
            const video = videoContainer.querySelector('video');
            if (video) {
                const totalSeconds = convertTimestampToSeconds(timestampInMilliseconds);
                video.currentTime = totalSeconds;
                video.pause();
            }
        }
    };

    const timestampLabel = intl.formatMessage(messages.commentMessageTimestampLabel);
    return React.createElement(
        React.Fragment,
        null,
        React.createElement(
            'div',
            {
                className: 'bcs-ActivityMessage-timestamp',
            },
            React.createElement(
                'button',
                {
                    'aria-label': timestampLabel,
                    type: 'button',
                    onClick: handleClick,
                },
                timestampInHHMMSS,
            ),
        ),
        textAfterTimestamp,
    );
};

export { convertTimestampToSeconds, convertMillisecondsToHMMSS, convertSecondsToHMMSS, formatTimestamp };
