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
const splitRegex = /((?:[@＠﹫]\[[0-9]+:[^\]]+])|(?:\b(?:(?:ht|f)tps?:\/\/)[\w\._\-]+(?::\d+)?(?:\/[\w\-_\.~\+\/#\?&%=:\[\]@!$'\(\)\*;,]*)?))/gim;

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

    return shouldReturnString ? contentItems.join('') : contentItems;
};

export default formatTaggedMessage;
