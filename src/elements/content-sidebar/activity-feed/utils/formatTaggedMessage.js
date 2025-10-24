/**
 * @flow
 * @file Util for formatting tagged messages
 */

import * as React from 'react';
import type { IntlShape } from 'react-intl';
import { Link } from '../../../../components/link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import UserLink from '../common/user-link';
import messages from '../common/activity-message/messages';
import { convertTimestampToSeconds, convertMillisecondsToHMMSS } from '../../../../utils/timestamp';

/**
 * Formats text containing a timestamp by wrapping the timestamp in a Link component
 * @param text The text containing the timestamp
 * @param timestamp The timestamp string
 * @param intl The intl object method to add the timestamp aria label
 * @returns A React Fragment with formatted timestamp
 */
const formatTimestamp = (text: string, timestamp: string, intl: IntlShape): React$Element<any> | string => {
    if (!timestamp || typeof timestamp !== 'string') {
        return text;
    }
    const textAfterTimestamp = text.replace(timestamp ?? '', '');
    const strippedTimestamp = timestamp.replace(/#\[|\]/g, '');
    if (!strippedTimestamp) {
        return text;
    }

    const timestampSection = /timestamp:\d+/.exec(timestamp);
    const timestampValue = timestampSection && timestampSection[0] ? timestampSection[0].split(':')[1] : null;
    const timestampInMilliseconds = parseInt(timestampValue, 10);
    if (Number.isNaN(timestampInMilliseconds)) {
        return textAfterTimestamp;
    }
    // convert milliseconds to HH:MM:SS
    const timestampInHHMMSS = convertMillisecondsToHMMSS(timestampInMilliseconds);

    const handleClick = (e: SyntheticMouseEvent<HTMLButtonElement>): void => {
        e.preventDefault();
        const videoContainer = document.querySelector('.bp-media-dash');
        if (videoContainer) {
            // $FlowFixMe: querySelector('video') returns an HTMLVideoElement
            const video: ?HTMLVideoElement = videoContainer.querySelector('video');
            if (video) {
                const totalSeconds = convertTimestampToSeconds(timestampInMilliseconds);
                video.currentTime = totalSeconds;
                video.pause();
            }
        }
    };

    // eslint-disable-next-line no-use-before-define
    return renderTimestampWithText(timestampInHHMMSS, handleClick, intl, textAfterTimestamp, undefined);
};

// this regex matches one of the following regular expressions:
// mentions: ([@＠﹫]\[[0-9]+:[^\]]+])
// urls: (?:\b)((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(:\d+)?(\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)
// NOTE: There are useless escapes in the regex below, should probably remove them when safe
/* eslint-disable no-useless-escape */
const splitRegex =
    /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?))/gim;
// eslint-enable no-useless-escape
/**
 * Formats a message a string and replaces the following:
 * - all occurrence of mention patterns with a UserLink component
 * - all occurrence of urls with a Link component
 * Ex mention format: @[123:Hello World]
 * @param {String} tagged_message The message string to format
 * @param {String} itemID The id of the tagged message
 * @param {Boolean} shouldReturnString The boolean value whether it should return string
 * @param {Function} [getUserProfileUrl] The method to generate a user profile url
 * @param {IntlShape} intl The intl object method to add the timestamp aria label
 * @returns {String|Array<React.Node|String>}
 */
const formatTaggedMessage = (
    tagged_message: string,
    itemID: string,
    shouldReturnString: boolean,
    getUserProfileUrl?: Function,
    intl: IntlShape,
): string | Array<React.Node | string> => {
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
            const timestampMatch = text.match(/#\[timestamp:\d+,versionId:\d+\]/);
            const timestamp = timestampMatch && timestampMatch[0];
            if (timestamp) {
                return formatTimestamp(text, timestamp, intl);
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

/**
 * Renders the timestamp button and remaining text
 * @param timestampInHHMMSS The formatted timestamp string (HH:MM:SS)
 * @param handleClick The click handler for the timestamp button
 * @param intl The intl object method to add the timestamp aria label
 * @param textAfterTimestamp The text that comes after the timestamp
 * @param getUserProfileUrl The function to get the user profile url
 * @returns A React Fragment with timestamp button and text
 */
export function renderTimestampWithText(
    timestampInHHMMSS: string,
    handleClick: (e: SyntheticMouseEvent<HTMLButtonElement>) => void,
    intl: IntlShape,
    textAfterTimestamp: string,
    getUserProfileUrl?: Function,
): React$Element<any> {
    return (
        <>
            <div className="bcs-ActivityMessage-timestamp">
                <button
                    aria-label={intl.formatMessage(messages.activityMessageTimestampLabel)}
                    type="button"
                    onClick={handleClick}
                >
                    {timestampInHHMMSS}
                </button>
            </div>
            {getUserProfileUrl
                ? // eslint-disable-next-line no-use-before-define
                  formatTaggedMessage(textAfterTimestamp, '', false, getUserProfileUrl, intl)
                : textAfterTimestamp}
        </>
    );
}

export default formatTaggedMessage;
