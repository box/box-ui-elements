/**
 * @flow
 * @file Util for formatting tagged messages
 */

import * as React from 'react';
import { Link } from '../../../../components/link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import UserLink from '../common/user-link';

// this regex matches one of the following regular expressions:
// mentions: ([@＠﹫]\[[0-9]+:[^\]]+])
// urls: (?:\b)((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(:\d+)?(\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)
// NOTE: There are useless escapes in the regex below, should probably remove them when safe
// eslint-disable-next-line
const splitRegex =
    /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?))/gim;

/**
 * Converts a timestamp string (hh:mm:ss) to total seconds
 * @param {string} timestamp The timestamp string in format "hh:mm:ss"
 * @returns {number} The total seconds
 */
const convertTimestampToSeconds = (timestamp: string): number => {
    const timeParts = timestamp.split(':');
    const hours = parseInt(timeParts[0], 10) || 0;
    const minutes = parseInt(timeParts[1], 10) || 0;
    const seconds = parseInt(timeParts[2], 10) || 0;
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    return totalSeconds;
};

/**
 * Formats text containing a timestamp by wrapping the timestamp in a Link component
 * @param {string} text The text containing the timestamp
 * @param {RegExpMatchArray} timestampMatch The regex match result for the timestamp
 * @param {string} contentKey The key to use for the React Fragment
 * @returns {React.Node} A React Fragment with formatted timestamp
 */
const formatTimestamp = (text: string, timestampMatch: RegExpMatchArray, contentKey: string): React.Node => {
    const [, timestamp] = timestampMatch;
    const beforeTimestamp = text.substring(0, timestampMatch.index);
    const afterTimestamp = text.substring(timestampMatch.index + timestamp.length);
    const handleClick = e => {
        e.preventDefault();
        const videoContainer = document.querySelector('.bp-media-dash');
        if (videoContainer) {
            const video = videoContainer.querySelector('video');
            if (video) {
                const totalSeconds = convertTimestampToSeconds(timestamp);
                video.currentTime = totalSeconds;
            }
        }
    };
    return (
        <React.Fragment key={contentKey}>
            {beforeTimestamp}
            <Link href={`#${timestamp}`} onClick={handleClick}>
                {timestamp}
            </Link>
            {afterTimestamp}
        </React.Fragment>
    );
};

/**
 * Formats a message a string and replaces the following:
 * - all occurrence of mention patterns with a UserLink component
 * - all occurrence of urls with a Link component
 * Ex mention format: @[123:Hello World]
 * @param {String} tagged_message The message string to format
 * @param {String} itemID The id of the tagged message
 * @param {Boolean} shouldReturnString The boolean value whether it should return string
 * @param {Function} [getUserProfileUrl] The method to generate a user profile url
 * @returns {String|React.Node}
 */
const formatTaggedMessage = (
    tagged_message: string,
    itemID: string,
    shouldReturnString: boolean,
    getUserProfileUrl?: Function,
): React.Node | string => {
    const contentItems = tagged_message.split(splitRegex).map((text: string, contentIndex: number) => {
        const contentKey = `${contentIndex}-${itemID}`;
        // attempt mention match
        const mentionMatch = text.match(/([@＠﹫])\[([0-9]+):([^\]]+)]/i);
        if (mentionMatch) {
            const [, trigger, id, name] = mentionMatch;
            if (shouldReturnString) {
                return `${trigger}${name}`;
            }

            return (
                <UserLink
                    key={contentKey}
                    className="bcs-comment-mention"
                    data-resin-target={ACTIVITY_TARGETS.MENTION}
                    getUserProfileUrl={getUserProfileUrl}
                    id={id}
                    name={`${trigger}${name}`}
                />
            );
        }

        // Check for timestamp in first item only
        if (contentIndex === 0 && !shouldReturnString) {
            const timestampMatch = text.match(/(\d{1,2}:\d{2}:\d{2})/);
            if (timestampMatch) {
                return formatTimestamp(text, timestampMatch, contentKey);
            }
        }

        if (!shouldReturnString) {
            // attempt url match
            // NOTE: There are useless escapes in the regex below, should probably remove them when safe
            const urlMatch = text.match(
                // eslint-disable-next-line no-useless-escape
                /((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)/i,
            );
            if (urlMatch) {
                const [, url] = urlMatch;
                return (
                    <Link key={contentKey} href={url}>
                        {url}
                    </Link>
                );
            }
        }

        return text;
    });

    if (shouldReturnString) {
        return contentItems.join('');
    }

    return contentItems;
};

export default formatTaggedMessage;
