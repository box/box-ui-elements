/**
 * @flow
 * @file Util for formatting tagged messages
 */

import * as React from 'react';
import type { IntlShape } from 'react-intl';
import { formatTimestamp } from '../../../../utils/timestampUtils';
import { Link } from '../../../../components/link';
import { ACTIVITY_TARGETS } from '../../../common/interactionTargets';
import UserLink from '../common/user-link';

// this regex matches one of the following regular expressions:
// mentions: ([@＠﹫]\[[0-9]+:[^\]]+])
// urls: (?:\b)((?:(?:ht|f)tps?:\/\/)[\w\._\-]+(:\d+)?(\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?)
// NOTE: There are useless escapes in the regex below, should probably remove them when safe
/* eslint-disable */
const splitRegex =
    /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?))/gim;
/* eslint-disable */

/**
 * Formats a message a string and replaces the following:
 * - all occurrence of mention patterns with a UserLink component
 * - all occurrence of urls with a Link component
 * Ex mention format: @[123:Hello World]
 * @param {String} tagged_message The message string to format
 * @param {String} itemID The id of the tagged message
 * @param {Boolean} shouldReturnString The boolean value whether it should return string
 * @param {Function} [getUserProfileUrl] The
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

export default formatTaggedMessage;
